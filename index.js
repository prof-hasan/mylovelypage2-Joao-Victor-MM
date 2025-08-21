window.onload = function() {
      let tent = localStorage.getItem('tent');
      if (tent === null) {
        tent = 0;
      } else {
        tent = parseInt(tent) + 1;
      }

      localStorage.setItem('tent', tent);

      document.title = "Tentativa: " + tent;
    }