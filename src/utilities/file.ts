import { existsSync, unlink } from 'fs';
import { join } from 'path';

export async function removeFile(path: string, name: string) {
  const pathName = join(path, name);
  console.log(pathName);
  if (existsSync(pathName)) {
    console.log('deleting...');
    unlink(pathName, (err) => {
      if (err) throw err;
      console.log(`${pathName} was deleted`);
    });
  }
}
