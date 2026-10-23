// Check by default. Apply only the versioned build/branch/path settings with --apply.
// Existing environment variables, deploy hooks, and other project settings are retained.
import {readFile} from 'node:fs/promises';
import {isDeepStrictEqual} from 'node:util';

const config = JSON.parse(await readFile(new URL('../deployment/cloudflare-pages.json', import.meta.url), 'utf8'));
const token = process.env.CLOUDFLARE_API_TOKEN;
if (!token) throw new Error('Set CLOUDFLARE_API_TOKEN to a credential with Pages read/edit access.');
if (process.argv.slice(2).some((arg) => arg !== '--apply')) throw new Error('Only --apply is supported; omit it to check settings.');
const apply = process.argv.includes('--apply');

async function request(name, method = 'GET', body) {
    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${config.account_id}/pages/projects/${name}`, {
        method,
        headers: {Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'},
        ...(body ? {body: JSON.stringify(body)} : {})
    });
    const data = await response.json();
    if (!response.ok || !data.success) throw new Error(`${name}: ${JSON.stringify(data.errors)}`);
    return data.result;
}

function managedSettings(project) {
    return {
        production_branch: project.production_branch,
        build_config: {
            build_command: project.build_config.build_command,
            destination_dir: project.build_config.destination_dir,
            root_dir: project.build_config.root_dir
        },
        source_config: {
            production_branch: project.source.config.production_branch,
            deployments_enabled: project.source.config.deployments_enabled,
            production_deployments_enabled: project.source.config.production_deployments_enabled,
            path_includes: project.source.config.path_includes,
            path_excludes: project.source.config.path_excludes
        }
    };
}

for (const [name, settings] of Object.entries(config.projects)) {
    const current = await request(name);
    const source = current.source;
    if (source?.type !== 'github' || `${source.config.owner}/${source.config.repo_name}` !== config.repository) {
        throw new Error(`${name}: unexpected source repository; refusing to reconfigure it.`);
    }
    const desired = {
        production_branch: config.production_branch,
        build_config: {build_command: settings.build_command, destination_dir: settings.destination_dir, root_dir: ''},
        source_config: {
            production_branch: config.production_branch,
            deployments_enabled: true,
            production_deployments_enabled: true,
            path_includes: [settings.app_path, ...config.shared_paths],
            path_excludes: []
        }
    };
    if (isDeepStrictEqual(managedSettings(current), desired)) {
        console.log(`${name}: configuration matches`);
        continue;
    }
    if (!apply) {
        console.error(`${name}: configuration differs`);
        process.exitCode = 1;
        continue;
    }
    await request(name, 'PATCH', {
        production_branch: desired.production_branch,
        build_config: {...current.build_config, ...desired.build_config},
        source: {...source, config: {...source.config, ...desired.source_config}}
    });
    if (!isDeepStrictEqual(managedSettings(await request(name)), desired)) {
        throw new Error(`${name}: configuration verification failed`);
    }
    console.log(`${name}: configuration applied and verified`);
}
