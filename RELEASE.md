## Release Documentation

The following will cover releasing the `asset-transfer-api-registry` to both github and NPM.

### Creating the Release Branch

1. Ensure you are in the `main` branch then run:

    ```bash
    $ git pull origin main
    $ git checkout -b <name>-vXX-XX-XX
    ```

1. In your new release branch update the version inside of the `package.json` to match the version we are releasing. This is super important as it will be the source of truth for updating to NPM.

1. Inside of the `CHANGELOG.md`, follow the previous format of other releases, and input each commit that is being added in this current release.
    - Note: For multiple chore: update registry commits, you can just mention one representative entry (similar to how it was done in `v0.3.0`release), rather than listing every individual registry update.

1. Run:

    ```bash
    $ git add .
    $ git commit -m 'chore(release): vXX.XX.XX'
    $ git push
    ```

    Then create a PR with the same title as the commit message.

1. When approved merge the PR into main.

### Creating the NPM release

#### Requirements

- You must be part of the integrations NPM team for substrate.
- You must have 2FA enabled.

#### Steps

1. Ensure your current working branch is `main`, and run the following as a sanity check.

    ```bash
    $ git pull origin main
    $ yarn build
    $ yarn test
    ```

1. Run:

    ```bash
    $ yarn deploy
    ```

    #### Notes

    - Ensure the logging provided by NPM says the current version that is going to get released is correct before you enter your OTP.
    - If you are on node version 18 or below, it will ask you for your OTP in the terminal. But if you are on node 20 or greater it will redirect you to the browser to input the OTP.

1. Tada! You should have now received a message saying that the package has been released. You can go to https://www.npmjs.com/package/@substrate/asset-transfer-api-registry to double check the release's success.

### Creating a Github release

1. Right after you have released the NPM package, we are going to set a tag that will match the version of the release:

    ```bash
    $ git tag vXX.XX.XX
    $ git push origin vXX.XX.XX
    ```

1. Once that is pushed to github, go to https://github.com/paritytech/asset-transfer-api-registry/tags, and in the tab where the new version has now been created, click on the 2 dots all the way to the right, and press `create release`.

1. Inside of `create release` you may copy the contents of the `CHANGELOG.md` for the release and input them there. For the title, just name it the version `vXX.XX.XX`.

1. Click `Publish as latest`, and that will complete the release process.
