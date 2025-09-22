const here = window.location.origin + window.location.pathname;
const hereParams = new URLSearchParams(window.location.search);
const clientId = "YtRJRPGAptLz7BuZWPY8ihNsOKAfDEve";
const code = hereParams.get('code');

const safeParse = s => { try { return JSON.parse(atob(s)); } catch (err) { return { parseError: err }; } };
const encode = s => btoa(JSON.stringify(s));

const state = safeParse(hereParams.get('state'));

const loginUrl = new URL("https://login.yotoplay.com/authorize");
const addParams = (url, params) => Object.entries(params).forEach(([key, param]) => url.searchParams.append(key, param));
addParams(loginUrl, {
  audience: "https://api.yotoplay.com",
  scope: "openid",
  response_type: "code",
  client_id: clientId,
  redirect_uri: here,
  state: encode({ hello: "world" })
});

/* INIT */

const main = document.querySelector('main');

const auth = document.createElement('a');
auth.innerText = "Authorize";
auth.href = loginUrl.href;

const debug = document.createElement('pre');
debug.innerText = JSON.stringify({ code, state }, null, 2);

[auth, debug].forEach(elem => main.appendChild(elem));
