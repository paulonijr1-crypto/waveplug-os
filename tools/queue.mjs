#!/usr/bin/env node
// The cross agent approval queue. Agent proposals land here instead of dying at
// the bottom of a learning log. Scout's log had 13 sitting unapproved for a month.
//
//   node tools/queue.mjs                    list everything pending
//   node tools/queue.mjs all                include approved and rejected
//   node tools/queue.mjs approve SC-05      approve one, or several ids
//   node tools/queue.mjs reject SC-10 SC-11
//   node tools/queue.mjs add Scout "Title" "Detail"

import { load, save, c, heading, rule, today, daysBetween } from './lib.mjs';

const FILE = 'state/queue.json';
const db = load(FILE);
const [cmd, ...args] = process.argv.slice(2);

const byId = (id) => db.proposals.find((p) => p.id.toUpperCase() === id.toUpperCase());

function setStatus(ids, status) {
  const hits = [];
  for (const id of ids) {
    const p = byId(id);
    if (!p) {
      console.log(c.red(`No proposal with id ${id}`));
      continue;
    }
    p.status = status;
    p.decided = today();
    hits.push(p);
  }
  if (hits.length) {
    save(FILE, db);
    const verb = status === 'approved' ? c.green('APPROVED') : c.red('REJECTED');
    for (const p of hits) console.log(`${verb}  ${p.id}  ${p.title}`);
    console.log(
      c.grey(`\n${hits.length} updated. ${db.proposals.filter((p) => p.status === 'pending').length} still pending.`)
    );
    if (status === 'approved') {
      console.log(
        c.yellow('Approved rules are not automatic. Fold each one into the owning agent file in .claude/agents/ so it actually binds.')
      );
    }
  }
}

function list(showAll) {
  const items = db.proposals.filter((p) => showAll || p.status === 'pending');
  const pending = db.proposals.filter((p) => p.status === 'pending');

  console.log(heading('AGENT APPROVAL QUEUE'));
  if (!items.length) {
    console.log(c.green('Nothing waiting on you. The fleet is clear.\n'));
    return;
  }

  const groups = {};
  for (const p of items) (groups[p.agent] ??= []).push(p);

  for (const [agent, list] of Object.entries(groups)) {
    console.log(`\n${c.bold(agent)}`);
    for (const p of list) {
      const age = daysBetween(p.proposed, today());
      const stale = age > 21 ? c.red(`${age}d old`) : age > 7 ? c.yellow(`${age}d old`) : c.grey(`${age}d old`);
      const mark =
        p.status === 'approved' ? c.green('[yes]') :
        p.status === 'rejected' ? c.red('[no] ') : c.yellow('[ ? ]');
      console.log(`  ${mark} ${c.bold(p.id)}  ${p.title}  ${stale}`);
      console.log(c.grey(`        ${p.detail}`));
    }
  }

  console.log(rule());
  if (pending.length > 5) {
    console.log(
      c.red(c.bold(`\n${pending.length} pending. Over the cap of 5.`)) +
        c.red('\nStanding rule SC-11: no agent proposes anything new until this is cleared.\nGive one yes or no pass over the list above.')
    );
  } else if (pending.length) {
    console.log(c.yellow(`\n${pending.length} pending, under the cap of 5.`));
  }
  const oldest = pending.map((p) => daysBetween(p.proposed, today())).sort((a, b) => b - a)[0];
  if (oldest > 14) {
    console.log(c.grey(`Oldest has been waiting ${oldest} days.`));
  }
  console.log(c.grey('\nApprove with: node tools/queue.mjs approve SC-05 SC-07\n'));
}

switch (cmd) {
  case 'approve':
    setStatus(args, 'approved');
    break;
  case 'reject':
    setStatus(args, 'rejected');
    break;
  case 'add': {
    const [agent, title, detail] = args;
    if (!agent || !title) {
      console.log('Usage: node tools/queue.mjs add <Agent> "<title>" "<detail>"');
      process.exit(1);
    }
    const prefix = agent.replace(/^The\s+/i, '').slice(0, 2).toUpperCase();
    const n = db.proposals.filter((p) => p.id.startsWith(prefix)).length + 1;
    const p = {
      id: `${prefix}-${String(n).padStart(2, '0')}`,
      agent,
      proposed: today(),
      status: 'pending',
      title,
      detail: detail ?? '',
    };
    db.proposals.push(p);
    save(FILE, db);
    console.log(c.green(`Added ${p.id}: ${p.title}`));
    break;
  }
  case 'all':
    list(true);
    break;
  default:
    list(false);
}
