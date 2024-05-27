Instructions

0 - Run npm install

1 - Create a .env file in the root directory of the frontend with the following content

EXPO_PUBLIC_API_URL=
EXPO_PUBLIC_TOKEN_KEY=

  Example:
  EXPO_PUBLIC_API_URL=http://172.22.176.1:3000 (Note - don't use 'localhost', it causes issues. Write out the ip address. The backend logs it on startup)
  EXPO_PUBLIC_TOKEN_KEY=my-jwt

2 - Fire up Android Studio, create a virtual device, get the virtual device started

3 - Run project with: <br />
npx expo start

4 - Press 'a' to run project on said virtual device
<br />

Alternatively, follow instructions at: https://docs.expo.dev/get-started/set-up-your-environment/?platform=android&device=simulated
<br />
<br />
Or connect with a real device

<br />
<br />

Tested on virtual android device Pixel 3a

