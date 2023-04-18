<!--  REACT CORE ISSUE FIXED  -->
# grep -rl "s.dependency 'React/Core'" node_modules/ | xargs sed -i '' 's=React/Core=React-Core=g'
# https://gitmemory.com/issue/tipsi/tipsi-stripe/785/861289460
# npm i --legacy-peer-deps
# rm -rf ./android/app/src/main/res/drawable-*
# rm -rf ./android/app/src/main/res/raw
# version tipsi stripe 16.9.0

# KEEP IN MIND WHILE CREATING BUILD
 1. Change stripe to pro in App.js
 2. Change server to 2 in utils -> config -> index.js
 3. Change constants.bandoServer in constants -> Endpoints (for genre)
 4. Increase app version from xcode (keeping build number in mind)
 5. Increase app version for android from build.gradle (keeping versionCode in mind)
 6. Change base url for deeplinking in android -> app -> src -> main -> AndroidManifest
 7.  Change app version in constants -> serviceAxios -> index.js (for header)
 8. Change app version in screens -> settings -> index.js (for email)
 9. Change refresh token url in constants -> serviceAxios -> index.js (for header)