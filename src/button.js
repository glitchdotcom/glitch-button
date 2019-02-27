/**
*  button.js
*  builds and displays the glitch button embed
*/

'use strict';

(function() {
  // don't show button if it's a custom domain
  if ( location.hostname.indexOf('glitch.me') === -1 && location.hostname.indexOf('glitch.com') === -1 ) {
    return;
  }
  
  // set up endpoint request for the glitch project information
  const { polyfill } = require('es6-promise');
  polyfill();
  const axios = require('axios');
  const glitchEndpoint = 'https://api.glitch.com/projects/';

  // define the default url, button elements class names and button svg source
  // if you remixed ~button make sure projectURL is updated to be your remix :)
  const projectURL = '//button.glitch.me';
  const glitchProfileURL = '//glitch.com/@';
  const glitchClass = 'glitchButton';
  const glitchButtonClass = 'glitchButtonElement';
  const glitchOpenWindowClass = 'glitchOpenWindowElement';
  const glitchButtonSrc = 'https://cdn.glitch.com/3fd2e3a7-3145-4c1d-9480-32a2e6a6963a%2Flogo-day.svg?1490800908258';

  // get project name from url
  const projectName = location.hostname.split('.')[0];
  
  // append button stylesheet
  var buttonStylesheet = document.createElement('link');
  buttonStylesheet.rel = 'stylesheet';
  buttonStylesheet.href = `${projectURL}/css/button.css`;
  document.head.appendChild(buttonStylesheet);
  
  // append theme stylesheet if that value is given and append
  const scriptElements = document.getElementsByTagName('script');
  [].forEach.call(scriptElements, scriptTag => {
    if ( scriptTag.getAttribute('src') && scriptTag.getAttribute('src').indexOf(projectURL) !== -1 ) {
      if ( scriptTag.dataset.style ) {
        var themeStylesheet = document.createElement('link');
        themeStylesheet.rel = 'stylesheet';
        themeStylesheet.href = `${projectURL}/css/${scriptTag.dataset.style}.css`;
        document.head.appendChild(themeStylesheet);
      }
    }
  });
  
  // helper: finding a given element's parent that has a given selector
  const findParent = (el, sel) => {
    while ( (el = el.parentElement) && !( (el.matches || el.matchesSelector || el.msMatchesSelector).call(el,sel) ) );
    return el;
  };
  
  // helper: close button windows
  const closeOpenButtonWindows = () => {
    const openButtonWindows = document.getElementsByClassName(glitchOpenWindowClass);
      [].forEach.call(openButtonWindows, buttonWindow => {
        buttonWindow.style.display = 'none';
        resetContents(buttonWindow);
      });
  }
  
  // event: glitch fish button is clicked
  const onButtonClick = e => {
    const parent = findParent(e.target, '.' + glitchClass);
    const thisWindow = parent.getElementsByClassName(glitchOpenWindowClass)[0];
    thisWindow.style.display = ( thisWindow.style.display === 'none' ) ? 'block' : 'none';
    resetContents(thisWindow);
  };
  
  // reset contents so all but embed code is visible
  const resetContents = (container) => {
    const projectInfo = container.getElementsByClassName('projectInfo')[0];
    const projectActions = container.getElementsByClassName('projectActions')[0];
    const projectEmbed = container.getElementsByClassName('projectEmbed')[0];
    projectInfo.style.display = 'block';
    projectActions.style.display = 'block';
    projectEmbed.style.display = 'none';
  }
  
  // show only embed code
  const showEmbed = (container) => {
    const projectInfo = container.getElementsByClassName('projectInfo')[0];
    const projectActions = container.getElementsByClassName('projectActions')[0];
    const projectEmbed = container.getElementsByClassName('projectEmbed')[0];
    projectInfo.style.display = 'none';
    projectActions.style.display = 'none';
    projectEmbed.style.display = 'block';
  }
  
  // event: key goes up anywhere on the app - if tabbed out of glitch button, hide all button windows
  window.onkeyup = e => {
    const parent = findParent(document.activeElement, '.' + glitchClass);
    if ( e.keyCode === 9 && !parent ) {
      closeOpenButtonWindows();
    }
  };
  
  // event: click happens anywhere on the app - if out of glitch button, hide all button windows
  window.onclick = e => {
    const parent = findParent(e.target, '.' + glitchClass);
    if (!parent) {
      closeOpenButtonWindows();
    }
  };
  
  // get project info and do what we came here for - embed cool glitch buttons!
  axios.get(glitchEndpoint + projectName)
    .then( ({data}) => {
      if ( !data ) {
        return null; 
      }
    
      const { domain, description, users } = data;
    
      // generate html for users list
      const usersCodeArray = users.map(user => {
        if ( !user.login ) {
          return null;
        }
        
        return `<li><a href="${glitchProfileURL}${user.login}?utm_source=${domain}&utm_medium=button&utm_campaign=glitchButton"><img width="25px" src="${user.avatarUrl}" alt="avatar of ${user.login}" /> <span class="name">${user.login}</span></a></li>`;
      });
    
      // generate html for the remix, view and embed buttons
      const remixLink = `<a class="buttonLinks remix" href="https://glitch.com/edit/#!/remix/${domain}?utm_source=${domain}&utm_medium=button&utm_campaign=glitchButton">Remix on Glitch</a>`;
      const viewCodeLink = `<a class="buttonLinks viewCode" href="https://glitch.com/edit/#!/${domain}?utm_source=${domain}&utm_medium=button&utm_campaign=glitchButton">View Source</a>`;
      const embedButton = `<button class="buttonLinks embed">Embed This App</button>`;
      const embed = `<div class="embedGlitchCode"><label>Copy and paste this code anywhere you want to embed this app.<textarea><div class="glitch-embed-wrap" style="height: 486px; width: 100%;">
  <iframe
    allow="geolocation; microphone; camera; midi; encrypted-media"
    src="https://glitch.com/embed/#!/embed/${domain}?previewSize=100&previewFirst=true&sidebarCollapsed=true"
    alt="${domain} on Glitch"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div></textarea>${viewCodeLink} to customize the embed under the "Share" menu.</label></div>`;
    
      // generate the html for inside the button tooltip using the above html generations
      const glitchProjectInfoHTML = 
        `<div class="project">
          <div class="projectInfo">
            <div class="name">${domain}</div>
            <p class="description">${description}</p>
            <div class="users">
              <ul>${usersCodeArray.join(' ')}</ul>
            </div>
          </div>
          <div class="projectActions">${remixLink}<br /> ${viewCodeLink}<br /> ${embedButton}</div>
          <div class="projectEmbed">${embed}</div>
        </div>`;
    
      const tooltipContent = `<span class="tooltip border"></span><span class="tooltip fill"></span>`;
    
      // attach our button and window content to each button parent element
      const buttonSpaces = document.getElementsByClassName(glitchClass);
  
      [].forEach.call(buttonSpaces, space => {
        const button = document.createElement('button');
        button.className = glitchButtonClass;
        button.innerHTML = `<img alt="This is a Glitch app!" width="50px" src="${glitchButtonSrc}" />`;
        
        const openWindow = document.createElement('div');
        openWindow.className = glitchOpenWindowClass;
        openWindow.style.display = 'none';
        openWindow.innerHTML = `${glitchProjectInfoHTML} <span class="tooltip border"></span><span class="tooltip fill"></span>`;

        // event to fire off on button click
        button.onclick = onButtonClick;
        
        space.appendChild(button);
        space.appendChild(openWindow);
        
        // hide embed section        
        // event to expand embed section
        const embedButton = space.getElementsByClassName('embed')[0];
        embedButton.onclick = e => {
          showEmbed(space);
        }
        
      });
    })
    .catch( err => {
      console.log(err);
    });
})();
