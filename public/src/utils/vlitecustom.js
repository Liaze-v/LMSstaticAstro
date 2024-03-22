          window.Vlitejs.registerProvider("youtube", window.VlitejsYoutube);
          window.Vlitejs.registerPlugin("volume-bar", window.VlitejsVolumeBar);
          new Vlitejs("#player", {
            options: {
            controls: true,
            autoplay: false,
            playPause: true,
            progressBar: true,
            time: true,
            volume: true,
            fullscreen: true,
            poster:
              "/src/img/procourse.png",
            bigPlay: true,
            playsinline: true,
            loop: false,
            muted: false,
            autoHide: false,
            providerParams: {},
          },
          provider: "youtube",
          plugins: ["volume-bar"],
          onReady: function (player) {
            console.log(player);
            player.on("play", () => console.log("play"));
            player.on("pause", () => console.log("pause"));
            player.on("progress", () => console.log("progress"));
            player.on("timeupdate", () => console.log("timeupdate"));
            player.on("volumechange", () => console.log("volumechange"));
            player.on("enterfullscreen", () => console.log("enterfullscreen"));
            player.on("exitfullscreen", () => console.log("exitfullscreen"));
            player.on("enterpip", () => console.log("enterpip"));
            player.on("leavepip", () => console.log("leavepip"));
            player.on("trackenabled", () => console.log("trackenabled"));
            player.on("trackdisabled", () => console.log("trackdisabled"));
            player.on("ended", () => console.log("ended"));
          },
        });