const here = window.location.origin + window.location.pathname;

const loginUrl = new URL("https://login.yotoplay.com/authorize");
const addParams = (url, params) => Object.entries(params).forEach(([key, param]) => url.searchParams.append(key, param));
addParams(loginUrl, {
  audience: "https://api.yotoplay.com",
  scope: "openid",
  response_type: "code",
  client_id: "YtRJRPGAptLz7BuZWPY8ihNsOKAfDEve",
  redirect_uri: here,
  state: "def"
});

/* INIT */

const main = document.querySelector('main');
const auth = document.createElement('a');
auth.innerText = "Authorize";
auth.href = loginUrl.href;

main.appendChild(auth);
