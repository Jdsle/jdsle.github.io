const h_transition_fade = "opacity 0.083s linear";

const h_transition_minimize = "transform 0.163s cubic-bezier(1, 0, 1, 1)";
const h_transition_restore = "transform 0.163s cubic-bezier(0, 0, 0, 1)";

const h_transition_open = `${h_transition_fade}, transform 0.333s cubic-bezier(0, 1, 0, 1)`;
const h_transition_close = `${h_transition_fade}, transform 0.167s cubic-bezier(1, 0, 1, 1)`;

function h_window_setupdrag(id) {
  let isDragging = false;
  let offsetX, offsetY;

  // Drag Region Element > Window > Window Container
  const h_window_titlebar = document.getElementById(id);
  const h_window_container = h_window_titlebar.parentElement

  if (h_window_titlebar) {
    h_window_titlebar.addEventListener("mousedown", (e) => {
      if (e.target.tagName.toLowerCase() !== 'button') {
        isDragging = true;
        offsetX = e.clientX - h_window_titlebar.getBoundingClientRect().left;
        offsetY = e.clientY - h_window_titlebar.getBoundingClientRect().top;
        e.preventDefault();
      }
    });

    document.addEventListener("mousemove", (e) => {
      if (isDragging) {
        const newX = e.clientX - offsetX;
        const newY = e.clientY - offsetY;
        h_window_container.style.left = newX + "px";
        h_window_container.style.top = newY + "px";
      }
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
    });

    document.addEventListener("mouseleave", () => {
      if (isDragging) {
        isDragging = false;
      }
    });
  }
}

function h_window_action_minimize(id) {
  const h_window = document.getElementById(id);
  if (h_window) {
    h_window.style.transition = h_transition_minimize;
    h_window.style.transform = "scale(0)";

    setTimeout(() => {
      h_window_action_restore(id);
    }, 1000);
  }
}

function h_window_action_restore(id) {
  const h_window = document.getElementById(id);
  if (h_window) {
    h_window.style.transition = h_transition_restore;
    h_window.style.transform = "scale(1)";
    
    setTimeout(() => {
      h_window.style.transition = null;
      h_window.style.transform = null;
    }, 163);
  }
}

function h_window_action_close(id) {
  const h_window = document.getElementById(id);
  if (h_window) {
    h_window.style.transition = h_transition_close;
    h_window.style.opacity = 0;
    h_window.style.transform = "scale(0)";

    setTimeout(() => {
      h_window.remove();
    }, 167);
  }
}

function h_window_action_open(id) {
  const h_window = document.getElementById(id);
  if (h_window) {
    h_window.style.transition = h_transition_open;
    h_window.style.transform = "scale(1)";
    h_window.style.opacity = 1;

    setTimeout(() => {
      h_window.style.transition = null;
      h_window.style.transform = null;
      h_window.style.opacity = null;
    }, 333);
  }
}


// the other ones are started with h_, which stands for html
// thought I'd take the chance to name this hwnd lol

// also, I know how bad this function is... trust me, I'm sorry :(

function hwnd_create(icon, title, contentlink) {
  const wnd_id_gen = Math.random().toString(36).substr(2, 6);
  const wnd_id = `${title}-${wnd_id_gen}`;

  const container = document.createElement("div");
  container.setAttribute('id', `${wnd_id}`);
  container.setAttribute('class', `content-dialog size-standard svelte-1szmc6y`);
  container.setAttribute('style', `position: absolute; background-color: transparent; inline-size: unset; max-inline-size: unset; opacity: 0; transform: scale(0);`);

  container.innerHTML = `
  
    <div style="height:32px; display: flex; position: relative; z-index: 1;" id="${wnd_id}-TitleElement">
      <div style="display: flex; align-items: center; padding-left: 4px">
        <svg height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg" style="margin-left: 12px; margin-right: 12px">
          <image height="16" href="${icon}" width="16"></image>
        </svg>
        <span class="svelte-zxj483 text-block type-body" id="${wnd_id}-WindowTitle"style="color: var(--fds-text-primary); user-select: none; -moz-user-select: none; -webkit-user-select: none;">${title}</span>
      </div>
      <div style="margin-left: auto">
        <button class="icon-button svelte-1iys5lx" style="min-inline-size: auto; width: 46px; height: 32px; border-radius: 0; position: relative; z-index: 2;" onclick="h_window_action_minimize('${wnd_id}')">
          <svg height="11" viewBox="0 0 10 2" width="10" xmlns="http://www.w3.org/2000/svg" style="inline-size: auto">
            <image height="2" href="/Assets/FluentIcons/ChromeMinimize.svg" width="10"></image>
          </svg>
        </button>
        <button class="icon-button svelte-1iys5lx" style="min-inline-size: auto; width: 46px; height: 32px; border-radius: 0; position: relative; z-index: 2;" onclick="h_window_action_close('${wnd_id}')">
          <svg height="11" viewBox="0 0 10 11" width="10" xmlns="http://www.w3.org/2000/svg" style="inline-size: auto">
            <image height="11" href="/Assets/FluentIcons/ChromeClose.svg" width="10"></image>
          </svg>
        </button>
      </div>
    </div>

    <iframe id="${wnd_id}-ContentHost" style="border: none; width: 100%; height: 100%; position: relative; z-index: 1;"></iframe>

    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
      <div class="mica-alt_layer"></div>
      <div class="mica-alt_layer2"></div>
    </div>

`;

  // Add the window to the layout, gotta add it before the wallpaper tho
  document.body.insertBefore(container, document.body.firstElementChild);

  const WindowTitle = document.getElementById(`${wnd_id}-WindowTitle`);
  const ContentHost = document.getElementById(`${wnd_id}-ContentHost`);

  ContentHost.src = contentlink;

  ContentHost.addEventListener('load', function () {

    h_window_setupdrag(`${wnd_id}-TitleElement`);
    h_window_action_open(`${wnd_id}`);

    console.log(`Window ${wnd_id} loaded`);

    // Check for title changes
    new MutationObserver(function (mutationsList) {
      for (let mutation of mutationsList) {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          WindowTitle.textContent = ContentHost.contentDocument.title;
        }
      }
    }).observe(ContentHost.contentDocument, { childList: true, subtree: true });

    if (ContentHost.contentWindow.document.body.clientWidth != 0) {
      new ResizeObserver(function (entries) {
        ContentHost.style.width = ContentHost.contentWindow.document.body.clientWidth + "px";
        ContentHost.style.height = ContentHost.contentWindow.document.body.clientHeight + "px";
      }).observe(ContentHost.contentDocument.body);
    }
    else {
      ContentHost.style.width = "800px";
      ContentHost.style.height = "600px";
    }
  });
}
