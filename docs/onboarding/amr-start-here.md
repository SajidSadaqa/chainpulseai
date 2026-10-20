# Amr — start here

Repository: [SajidSadaqa/chainpulseai](https://github.com/SajidSadaqa/chainpulseai). Status checked on 20 October 2026.

## Access and first steps

The repository is public, so you can read and clone it. Amr’s collaborator/write access is **unverified**: his exact GitHub username has not been supplied, and the collaborators page requires the repository owner to complete GitHub reauthentication. No invitation was sent; neither pending nor accepted invitation status can be confirmed.

Send the lead your exact username. The lead must check existing access, invite you with write access if needed, and record pending/accepted status after verification. Accept the invitation in your own account before pushing. Mahmoud’s and Nermeen’s GitHub accounts are not available yet; their responsibilities are named in the dependency issues without guessed assignees.

With Git installed, run:

```sh
git clone https://github.com/SajidSadaqa/chainpulseai.git
cd chainpulseai
git switch main
git pull --ff-only origin main
```

These onboarding files are proposed on `docs/amr-onboarding` until the onboarding PR receives human review and is merged. You can read them on that branch now. Wait for the merge before beginning the practice exercise from main.

## TEAM-101 practice

Read [the full beginner instructions](TEAM-101-amr.md), then edit [your practice file](practice/amr.md) yourself. [Issue #1](https://github.com/SajidSadaqa/chainpulseai/issues/1) tracks your exercise.

Use branch `feature/team-101-amr-practice` and open your own PR against `main` at [Pull requests](https://github.com/SajidSadaqa/chainpulseai/pulls). Proposed human reviewer: project lead / repository owner **@SajidSadaqa**. Reviewer designation is **not yet confirmed**; ask the lead to confirm or nominate someone. Request the reviewer in the PR sidebar; if unavailable, ask the lead to arrange review.

Completion requires your own Git workflow, human review, addressing feedback, and an approved merged PR. The onboarding PR does not complete TEAM-101.

## Data and API handoffs

| Input | Responsible owner | Current status / exact tracker | What unlocks it |
| --- | --- | --- | --- |
| Clean market sample JSON and field definitions | Nermeen (Nermin) | **Pending** — [issue #2](https://github.com/SajidSadaqa/chainpulseai/issues/2) | Nermeen provides the actual JSON URL, links a data dictionary when available, and records human approval/review status. |
| API sample response shape, TEAM-104 | Mahmoud | **Pending** — [issue #3](https://github.com/SajidSadaqa/chainpulseai/issues/3) | Mahmoud shares the real contract/sample with Amr and Nermeen and records approval/review status. |

No approved market JSON, data dictionary, API sample, or OpenAPI contract was found. The repository was empty, with no branches/files and no existing issues or open/closed PRs before onboarding setup. These issues request planned deliverables; they are not approved assets. Do not treat an issue description as a data model or API contract.

For **TEAM-103**, wait for Mahmoud’s sample. Amr then posts frontend-oriented feedback on issue #3 or the linked contract PR, identifies TEAM-103, links the reviewed version, and describes questions and frontend implications. Mahmoud owns contract decisions. Record the feedback URL for follow-up.

## Week 1 task references

| Task | Reference and next action |
| --- | --- |
| TEAM-101 | [Issue #1](https://github.com/SajidSadaqa/chainpulseai/issues/1) and [instructions](TEAM-101-amr.md). Complete personally after access and onboarding merge. |
| WEB-101 | Existing assignment reference supplied for Week 1. No original task description or GitHub issue was present; ask the lead for the authoritative brief/link before implementation. |
| WEB-102 | Existing assignment reference supplied for Week 1. No original task description or GitHub issue was present; ask the lead for the authoritative brief/link before implementation. |
| WEB-103 | Existing assignment reference supplied for Week 1. No original task description or GitHub issue was present; ask the lead for the authoritative brief/link before implementation. |
| TEAM-103 | Amr’s frontend review of Mahmoud’s TEAM-104 API shape; pending [issue #3](https://github.com/SajidSadaqa/chainpulseai/issues/3), with feedback instructions above. |

The WEB task identifiers are preserved without inventing their scope or marking them complete.

## Available versus blocked

Available now: public repository and cloning, TEAM-101 tracker, dependency trackers, and proposed onboarding instructions on the docs branch.

Pending before TEAM-101 push: verified write access/invitation acceptance, onboarding PR merge, and confirmed human reviewer. TEAM-101 does not need the market or API handoffs.

Blocked: data-dependent dashboard work awaits Nermeen’s approved handoff; contract-specific TEAM-103 feedback awaits Mahmoud’s shape. Exact WEB task scope awaits the lead’s original briefs. No substitute dataset or speculative contract has been created.

Ownership stays with the assigned teammates: Amr implements his frontend work and completes his exercise; Nermeen owns data and validation; Mahmoud owns backend and contracts; Mary owns blockchain research and AI specifications. This setup only provides onboarding documentation and coordination.
