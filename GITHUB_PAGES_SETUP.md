# GitHub Pages setup

The deployment workflow is already configured in `.github/workflows/deploy.yml`.

1. Push the completed code to the `main` branch.
2. Open the repository on GitHub and go to **Settings → Actions → General**.
3. Under **Workflow permissions**, select **Read and write permissions** and save.
4. Go to **Settings → Pages**.
5. Select **Deploy from a branch**, then choose `gh-pages` and `/ (root)`.
6. Open the **Actions** tab and wait for “Deploy RoadReady to GitHub Pages” to finish.

The application will be available at:

`https://hasansust32.github.io/UK_Driving_Theory_Flashcard/`

If the workflow fails, open its log and confirm it completed `pnpm install`, `pnpm run check`, and `pnpm run build:client`.
