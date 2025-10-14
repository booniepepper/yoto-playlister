import { clientId } from './constants.mjs';

let device = localStorage.getItem('device');
if (!device) {
  device = crypto.randomUUID();
  localStorage.setItem('device', device);
}

const encode = s => btoa(JSON.stringify(s));
const decode = s => { try { return JSON.parse(atob(s)); } catch (err) { return { parseError: err }; } };

const fetchJson = async (url, options) => await fetch(url, options).then(r => r.json());

const here = window.location.origin + window.location.pathname;
const hereParams = new URLSearchParams(window.location.search);
const state = decode(hereParams.get('state'));

const loginUrl = new URL("https://login.yotoplay.com/authorize");
const addParams = (url, params) => Object.entries(params).forEach(([key, param]) => url.searchParams.append(key, param));
addParams(loginUrl, {
  audience: "https://api.yotoplay.com",
  scope: "openid profile offline_access",
  response_type: "code",
  client_id: clientId,
  redirect_uri: here,
  state: encode({ hello: "world" })
});


/* INIT */

const myStuff = document.querySelector('#my_stuff');

const cards = document.createElement('div');
cards.id = "myo_cards";

const auth = document.createElement('a');
auth.innerText = "Authorize";
auth.href = loginUrl.href;

const debug = document.createElement('pre');

[auth, cards, debug].forEach(elem => myStuff.appendChild(elem));

const code = hereParams.get('code');
if (code) {
  const response = await fetchJson('https://api.yoto-playlister.so.dang.cool/prod/session', {
    method: 'PUT',
    headers: {
      device,
      code,
    },
  });
  console.log({ response });

  // Drop code fron URL to prevent sharing by accident
  history.pushState(null, null, here);
}
debug.innerText = JSON.stringify({ code, state }, null, 2);
const myos = await fetch("https://api.yoto-playlister.so.dang.cool/prod/myos", { headers: { device }}).then(r => r.json());
debug.innerText += "/n" + JSON.stringify({ cards }, null, 2);

myos.cards.forEach(async json => {
  const { cardId, title: cardTitle } = json;
  const cardImg = json.metadata.cover.imageL;
  
  const card = document.createElement('table');
  card.classList.add('card');
  card.id = cardId;
  card.innerHTML = `
    <thead>
      <tr>
        <th colspan="2"><h4>${cardTitle}</h4></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="right">Card Id</td>
        <td class="left"><pre>${cardId}</pre></td>
      </tr>
      <tr>
        <td><img class="yoto-card" src="${cardImg}" width="200" height="317"></td>
        <td class="tracklist left"></td>
      </tr>
      <tr>
        <td><input type="button" value="Create Public Playlist"></td>
        <td><input type="button" value="Save in my Account"></td>
      </tr>
    </tbody>`;

  cards.appendChild(card);

  const tracks = document.createElement('ol');
  tracks.class = "tracklist";
  card.querySelector('.tracklist').appendChild(tracks);

  const myoTracks = await fetch("https://api.yoto-playlister.so.dang.cool/prod/myos/tracks", { headers: { device, 'card-id': cardId }}).then(r => r.json());

  myoTracks.content.chapters.forEach(json => {
    const { title: trackTitle } = json;
    const track = document.createElement('li');
    // TODO: Fetch/cache image URLs
    track.innerHTML = `
      <label contenteditable="plaintext-only">${trackTitle}</label>
    `;
    tracks.appendChild(track);
  });
});
