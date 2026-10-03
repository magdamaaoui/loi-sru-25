import {mkdir, writeFile} from 'node:fs/promises';
import {isDeepStrictEqual} from 'node:util';
import {getCliClient} from '../../studio/node_modules/sanity/lib/cli.js';
import {CASE_STUDY_IMAGE_IDS} from '../../src/lib/data/case-study-ids';
import {localPostOccupancyCaptions} from '../../src/lib/data/post-occupancy-content';
import {localAcknowledgements} from '../../src/lib/data/introduction-content';
import {editorialStoryToPortableText} from './editorial-portable-text';

// Run from studio with sanity exec and --with-user-token. Dry run unless --apply is supplied.
const client = getCliClient({apiVersion: '2026-09-07'}).withConfig({useCdn: false, perspective: 'raw'});
const ids = ['postOccupancyPage', 'introductionPage'].flatMap(id => [id, `drafts.${id}`]);
const docs = await client.fetch('*[_id in $ids]', {ids});
for (const id of ['postOccupancyPage', 'introductionPage']) {
    if (!docs.some((doc: any) => doc._id === id)) throw new Error(`Missing ${id}`);
}
let transaction = client.transaction();
const expected: any[] = [];
for (const doc of docs) {
    const fields: Record<string, any[]> = {};
    for (const language of ['en', 'fr'] as const) {
        const suffix = language === 'en' ? 'En' : 'Fr';
        if (doc._id.endsWith('postOccupancyPage')) {
            const field = `imageCaptions${suffix}`;
            const existing = doc[field];
            if (!Array.isArray(existing)) throw new Error(`Missing ${field}`);
            const existingIds = existing.map((entry: any) => entry.imageId);
            if (!isDeepStrictEqual(existingIds, CASE_STUDY_IMAGE_IDS.filter(id => existingIds.includes(id)))) throw new Error(`Unexpected caption IDs: ${doc._id}.${field}`);
            const next = CASE_STUDY_IMAGE_IDS.map(imageId => {
                const entry = existing.find((candidate: any) => candidate.imageId === imageId);
                if (entry) return entry;
                if (!imageId.startsWith('tour-bois-le-pretre-plan-')) throw new Error(`Missing original caption ${imageId}`);
                return {_key: imageId, _type: 'imageCaption', imageId, caption: localPostOccupancyCaptions[language][imageId]};
            });
            if (!isDeepStrictEqual(existing, next)) fields[field] = next;
        } else {
            const field = `acknowledgements${suffix}`;
            const existing = doc[field];
            if (!Array.isArray(existing)) throw new Error(`Missing ${field}`);
            if (existing.some((block: any) => block._key === 'tour-project-documentation')) continue;
            const team = existing.findIndex((block: any) => block.style === 'h3' && block.children?.some((span: any) => /Research Assistantship Team|Équipe d’assistants de recherche/.test(span.text)));
            if (team < 0) throw new Error(`Missing team heading: ${doc._id}.${field}`);
            const credit = localAcknowledgements[language].blocks.find(block => block.type === 'paragraph' && block.html.includes('El Croquis'))!;
            const converted = editorialStoryToPortableText({blocks: [credit], notes: []}, language, 'tour-credit');
            const block = {...converted.blocks[0], _key: 'tour-project-documentation'};
            fields[field] = [...existing.slice(0, team), block, ...existing.slice(team)];
        }
    }
    console.log(`${doc._id}: updating ${Object.keys(fields).join(', ') || 'nothing'}`);
    if (Object.keys(fields).length) {
        transaction = transaction.patch(client.patch(doc._id).ifRevisionId(doc._rev).set(fields));
        expected.push({...doc, ...fields});
    }
}
if (process.argv.includes('--apply') && expected.length) {
    await mkdir('../.sanity-import', {recursive: true});
    await writeFile(`../.sanity-import/before-tour-documentation-${Date.now()}.json`, JSON.stringify(docs, null, 2), {flag: 'wx', mode: 0o600});
    await transaction.commit();
    const content = (doc: any) => Object.fromEntries(Object.entries(doc).filter(([key]) => !['_rev', '_updatedAt'].includes(key)));
    for (const doc of expected) {
        const actual = await client.getDocument(doc._id);
        if (!actual || !isDeepStrictEqual(content(doc), content(actual))) throw new Error(`Verification failed: ${doc._id}`);
        console.log(`Verified ${doc._id}; unrelated content preserved.`);
    }
} else console.log('No content changed. Use --apply to save proposed additions.');
