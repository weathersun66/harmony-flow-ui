import './build-workspace.mjs';
import { cp, readFile } from 'node:fs/promises';
import { archiveCompatibilityOutput } from './workspace-output.mjs';
const output = (await readFile('test/workspace/artifacts/latest-build.txt','utf8')).trim();
await archiveCompatibilityOutput('demo-dist');
await cp(output,'demo-dist',{recursive:true});
console.log(JSON.stringify({status:'ok',output,compat:'demo-dist'}));
