window.onload = function() {
      let tent = localStorage.getItem('tent');
      if (tent === null) {
        tent = 0;
      } else {
        tent = parseInt(tent) + 1;
      }

      localStorage.setItem('tent', tent);

      document.title = "Tentativa: " + tent;

      
      const jogosSteam = [
        
        'https://store.steampowered.com/app/311690/Enter_the_Gungeon/',
        
        'https://store.steampowered.com/app/445980/Wizard_of_Legend/',
        
        'https://store.steampowered.com/app/588650/Dead_Cells/'
      ];
      const dds = document.querySelectorAll('dl > dd');
      dds.forEach((dd, i) => {
        dd.style.cursor = 'pointer';
        dd.addEventListener('click', () => {
          window.open(jogosSteam[i], '_blank');
        });
      });
    }