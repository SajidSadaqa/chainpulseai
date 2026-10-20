# TEAM-101 — Amr’s practice pull request

Owner: Amr. Tracker: [issue #1](https://github.com/SajidSadaqa/chainpulseai/issues/1).

This exercise must be completed personally by Amr. Preparation of these instructions does not complete any exercise step.

## Before starting

Install Git and a text editor, sign into your own GitHub account, and provide the project lead your exact GitHub username. The lead must verify or grant write access and you must accept any invitation before pushing. Do not share passwords or tokens.

Wait until the onboarding documentation PR is reviewed and merged into main so the practice file exists. The practice does not depend on market JSON or the API contract.

## Clone and create your branch

Open a terminal and run:

```sh
git clone https://github.com/SajidSadaqa/chainpulseai.git
cd chainpulseai
git switch main
git pull --ff-only origin main
git switch -c feature/team-101-amr-practice
```

If you already cloned the repository, start with `cd chainpulseai`. If Git asks for commit identity, configure your own name and email; ask the lead if unsure.

## Edit, commit, and push

Open `docs/onboarding/practice/amr.md` in your editor. Add one sentence introducing yourself and one sentence describing what you learned about branches. Save the file yourself.

```sh
git status
git diff -- docs/onboarding/practice/amr.md
git add docs/onboarding/practice/amr.md
git commit -m "docs: complete Amr TEAM-101 practice"
git push -u origin feature/team-101-amr-practice
```

Review the diff before committing. Stage only your practice file. Authenticate to GitHub using your own account when prompted. If push is denied, contact the lead about write access; do not push to main.

## Open the PR and request review

1. Open [this repository’s Pull requests page](https://github.com/SajidSadaqa/chainpulseai/pulls) and choose **New pull request**.
2. Set **base: main** and **compare: feature/team-101-amr-practice** in `SajidSadaqa/chainpulseai`. Confirm only your Markdown practice edit appears.
3. Use the title `TEAM-101: Amr practice pull request`. Explain your edit and reference issue #1. Create the PR yourself. This is separate from the onboarding documentation PR.
4. Under **Reviewers**, request the designated human reviewer. Proposed reviewer: the project lead, repository owner **@SajidSadaqa**. This is a proposal, not a confirmed assignment. Ask the lead to confirm or designate another reviewer before treating review as arranged. If the reviewer cannot be selected, ask the lead to arrange it.
5. Read feedback in the PR. Make requested edits locally on the same branch, then `git add docs/onboarding/practice/amr.md`, commit, and `git push`. Reply to the feedback and request another review when ready.
6. After human approval, have the authorized maintainer merge the practice PR under the team’s review policy. Record the merged PR link in issue #1.

## Acceptance criteria

- Amr personally clones, branches, edits, commits, pushes, opens the PR, and requests a reviewer.
- A human reviews the PR and Amr addresses feedback.
- The approved PR is merged and its URL is recorded in issue #1.

No application implementation is part of this exercise. Return to [Amr start here](amr-start-here.md) for Week 1 dependencies.
