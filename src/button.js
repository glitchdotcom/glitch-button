/**
*  button.js
*  standardizes the glitch button embed
*/

'use strict';

(function() {
  // set up endpoint request for the glitch project information
  const axios = require('axios');
  const glitchEndpoint = 'https://api.glitch.com/projects/';

  // define the default url, button elements class names and button svg source
  const projectURL = '//button.glitch.me';
  const glitchClass = 'glitchButton';
  const glitchButtonClass = 'glitchButtonElement';
  const glitchOpenWindowClass = 'glitchOpenWindowElement';
  const glitchButtonSrc = 'https://cdn.glitch.com/3fd2e3a7-3145-4c1d-9480-32a2e6a6963a%2Flogo-day.svg?1490800908258';

  // get project name
  const projectName = location.hostname.split('.')[0];
  
  // append button stylesheet
  var buttonStylesheet = document.createElement('link');
  buttonStylesheet.rel = 'stylesheet';
  buttonStylesheet.href = `${projectURL}/css/button.css`;
  document.head.appendChild(buttonStylesheet);
  
  // append theme stylesheet if that values is given and append
  const scriptElements = document.getElementsByTagName('script');
  [].forEach.call(scriptElements, scriptTag => {
    // if the script is the glitch button script, attach appropriate stylesheet if given
    if ( scriptTag.getAttribute('src') && scriptTag.getAttribute('src').indexOf(projectURL) !== -1 ) {
      if ( scriptTag.dataset.style ) {
        var themeStylesheet = document.createElement('link');
        themeStylesheet.rel = 'stylesheet';
        themeStylesheet.href = `${projectURL}/css/${scriptTag.dataset.style}.css`;
        document.head.appendChild(themeStylesheet);
      }
    }
  });
  
  // helper for finding button parent elements
  const findParent = (el, sel) => {
    while ( (el = el.parentElement) && !( (el.matches || el.matchesSelector).call(el,sel) ) );
    return el;
  };
  
  // add button to elements with with the glitchButton class
  const buttonSpaces = document.getElementsByClassName(glitchClass);
  
  // event fired off when a button is clicked
  const onButtonClick = e => {
    const parent = findParent(e.target, '.' + glitchClass);
    const thisWindow = parent.getElementsByClassName(glitchOpenWindowClass)[0];
    thisWindow.style.display = ( thisWindow.style.display === 'none' ) ? 'block' : 'none';
  };
  
  // event fired off when the user presses a key
  window.onkeyup = e => {
    // if tabbed and target isn't a glitch button, close all button windows
    if ( e.keyCode === 9 && !findParent(document.activeElement, '.' + glitchClass) ) {
      [].forEach.call(document.getElementsByClassName(glitchOpenWindowClass), buttonWindow => {
        buttonWindow.style.display = 'none';
      });
    }
  };
  
  // event to close all open button windows if document window is clicked
  window.onclick = e => {
    const parent = findParent(e.target, '.' + glitchClass);
    if (!parent) {
      const openWindows = document.getElementsByClassName(glitchOpenWindowClass);
      [].forEach.call(openWindows, openWindow => {
        openWindow.style.display = 'none';
      });
    }
  };
  
    
  // get project info and do what we came here for - embed cool glitch buttons!
  axios.get(glitchEndpoint + projectName)
    .then( ({ data }) => {
      const { domain, description, users } = data;
      const usersCodeArray = users.map(user => {
        return `<li><img width="25px" src="${user.avatarUrl}" alt="avatar of ${user.login}" />
          <span class="name">${user.login}</span>
        </li>`;
      });
      const remixLink = `<a class="buttonLinks remix" href="https://glitch.com/edit/#!/remix/${domain}">Remix on Glitch</a>`;
      const viewCodeLink = `<a class="buttonLinks viewCode" href="https://glitch.com/edit/#!/${domain}">View Source</a>`;
      
      // generate the html for inside the button tooltip
      const glitchProjectInfoHTML = 
        `<div class="project">
          <div class="name">${domain}</div>
          <p class="description">${description}</p>
          <div class="users">
            <ul>${usersCodeArray.join(' ')}</ul>
          </div>
          <div class="footer">${remixLink} ${viewCodeLink}</div>
        </div>`;
    
      // attach our button and window content to each button parent element
      [].forEach.call(buttonSpaces, space => {
        const button = document.createElement('button');
        button.className = glitchButtonClass;
        button.innerHTML = `<img alt="This is a Glitch app!" width="50px" src="${glitchButtonSrc}" />`;
        
        const openWindow = document.createElement('div');
        openWindow.className = glitchOpenWindowClass;
        openWindow.style.display = 'none';
        openWindow.innerHTML = `${glitchProjectInfoHTML} <span class="tooltip border"></span><span class="tooltip fill"></span>`
        
        // event to fire off on button click
        button.onclick = onButtonClick;
        
        space.appendChild(button);
        space.appendChild(openWindow);
        
      });
    })
    .catch( err => {
      console.log(err);
    });
})();
