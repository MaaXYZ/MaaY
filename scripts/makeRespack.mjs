import cp from 'child_process'
import { existsSync } from 'fs'
import fs from 'fs/promises'
import path from 'path'

function exec(cmd) {
  return new Promise((resolve, reject) => {
    cp.exec(cmd, err => {
      if (err) {
        console.log(err)
        reject()
      } else {
        resolve()
      }
    })
  })
}

await fs.mkdir('repo', { recursive: true })
for (const d of await fs.readdir('./respack')) {
  const dir = path.join('./respack', d)
  const cfg = JSON.parse(await fs.readFile(path.join(dir, 'cfg.json'), 'utf-8'))
  const repo = `repo/${d}`
  if (!existsSync(repo)) {
    console.log(d, 'clone')
    await exec(`git clone "${cfg.repo.url}" ${repo}`)
  } else {
    console.log(d, 'fetch')
    await exec(`git -C ${repo} fetch`)
  }
  console.log(d, 'checkout', cfg.repo.hash)
  await exec(`git -C ${repo} checkout "${cfg.repo.hash}"`)
  await fs.mkdir(`./assets/${d}/resource`, { recursive: true })
  for (const p in cfg.resource) {
    const from = path.join(repo, cfg.resource[p])
    const to = path.join(`./assets/${d}/resource`, p)
    if (!existsSync(to)) {
      console.log(d, 'symlink')
      await fs.symlink(path.join('../../..', from), to, 'dir')
    }
  }
  console.log(d, 'copy')
  await fs.copyFile(path.join(dir, 'control.json'), path.join(`./assets/${d}`, 'control.json'))
  await fs.copyFile(path.join(dir, 'resource.json'), path.join(`./assets/${d}`, 'resource.json'))
}
