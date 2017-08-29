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

    browser.browserAction.setPopup({
      popup: 'http://b.hatena.ne.jp/entry/' + tab.url,
      tabId: tab.id
    });
  }
}

browser.tabs.onActivated.addListener(loadTab => {
  browser.tabs.get(loadTab.tabId).then(t => updateHatebuBadge(t));
})

browser.tabs.onUpdated.addListener((tabId, changeInfo,tab) => updateHatebuBadge(tab));
