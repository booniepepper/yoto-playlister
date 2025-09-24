const here = window.location.origin + window.location.pathname;
const hereParams = new URLSearchParams(window.location.search);
const clientId = "YtRJRPGAptLz7BuZWPY8ihNsOKAfDEve";
const code = hereParams.get('code');

const encode = s => btoa(JSON.stringify(s));
const decode = s => { try { return JSON.parse(atob(s)); } catch (err) { return { parseError: err }; } };

const state = decode(hereParams.get('state'));

const loginUrl = new URL("https://login.yotoplay.com/authorize");
const addParams = (url, params) => Object.entries(params).forEach(([key, param]) => url.searchParams.append(key, param));
addParams(loginUrl, {
  audience: "https://api.yotoplay.com",
  scope: "openid profile",
  response_type: "code",
  client_id: clientId,
  redirect_uri: here,
  state: encode({ hello: "world" })
});

if (code) {
  const response = await fetch('https://api.yoto-playlister.so.dang.cool/prod/playlists', {
    headers: {
      Authorization: `Bearer ${code}`,
    },
  });
  const body = await response.json();
  console.log({ response, body });
}

/* INIT */

const main = document.querySelector('main');

const auth = document.createElement('a');
auth.innerText = "Authorize";
auth.href = loginUrl.href;

const debug = document.createElement('pre');
debug.innerText = JSON.stringify({ code, state }, null, 2);

[auth, debug].forEach(elem => main.appendChild(elem));
