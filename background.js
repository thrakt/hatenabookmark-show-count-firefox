let currentId = 0;

function updateHatebuBadge(tab) {
  if (tab.status === 'complete' && tab.url.startsWith('http')) {    
    const r = new XMLHttpRequest();
    r.onreadystatechange = () => {
      if(r.readyState === 4){
        let text = r.responseText;
        if(text.length > 3){
          text = 'HOT';
        }
        browser.browserAction.setBadgeText({text: text, tabId: tab.id});
      }
    }
    r.open('GET', 'http://api.b.st-hatena.com/entry.count?url=' + tab.url, true);
    r.send();
  }
}

browser.tabs.onActivated.addListener(loadTab => {
  currentId = loadTab.tabId;
  browser.tabs.get(loadTab.tabId).then(t => updateHatebuBadge(t));
})

browser.tabs.onUpdated.addListener((tabId, changeInfo,tab) => updateHatebuBadge(tab));

function openHatebuPage() {
  browser.tabs.get(currentId).then(t => {
    browser.tabs.create({
      url: 'http://b.hatena.ne.jp/entry/' + t.url,
      index: t.index + 1
      // , openerTabId: t.id
    }).then(nt => {
      // index option does not work on my environment
      browser.tabs.move(nt.id, {index: t.index + 1});
    });
  })
}

browser.browserAction.onClicked.addListener(openHatebuPage);
