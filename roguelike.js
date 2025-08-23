function comecar() {
    let podeAtirar = true;

    // tela do jogo
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100vw';
    container.style.height = '100vh';
    container.style.background = '#222';
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';
    container.id = 'tela';

    // personagem
    const personagem = document.createElement('div');
    personagem.id = 'personagem';
    personagem.style.width = '50px';
    personagem.style.height = '50px';
    personagem.style.background = 'rgba(83, 206, 34, 1)';
    personagem.style.borderRadius = '10px';
    personagem.style.position = 'absolute';
    personagem.style.display = 'flex';
    personagem.style.justifyContent = 'center';
    personagem.style.alignItems = 'center';
    personagem.style.fontFamily = 'Arial, sans-serif';
    personagem.style.fontSize = '20px';
    personagem.style.color = '#fff';

    container.appendChild(personagem);
    document.body.appendChild(container);

    // atributos
    let vidamax = 3; // vida máxima
    let vida = vidamax;
    let dmg = 1.0; // dano
    let perf = 1; // quantos inimigos o tiro pode acertar
    let speed = 4; // velocidade do personagem
    let vidamaxInimigo = 2; // vida máxima do inimigo
    let vidaInimigo = vidamaxInimigo; // vida do inimigo
    let velInimigo = 2; // velocidade do inimigo
    let intAtirar = 1000; // intervalo de tiro em ms
    let invulTempo = 1000; // tempo de invulnerabilidade em ms
    let XP = 0; // experiência
    let XPparaNivel = 5; // experiência necessária para subir de nível
    let dropXP = 3; // XP máximo que um inimigo pode dropar
    let HProubo = 0 // quantidade maxima de vida que pode ser roubada por inimigo
    let recover = 0; // vida recuperada ao subir de nível
    let danoI = 1; // dano que o inimigo causa ao personagem
    let debuff = 1; // multiplicador de dificuldade

    // movimentação
    let posX = window.innerWidth / 2 - 25;
    let posY = window.innerHeight / 2 - 25;
    let keys = { w: false, a: false, s: false, d: false }; // controle de teclas
    let invulneravel = false;

    // Função para atualizar a exibição do XP na tela
    function atualizarXP() {
        const aba = document.getElementById('abaXP');
        if (aba) {
            aba.textContent = `XP: ${XP} / ${XPparaNivel}`;
        } else {
            const novaAba = document.createElement('div');
            novaAba.id = 'abaXP';
            novaAba.style.position = 'fixed';
            novaAba.style.bottom = '20px';
            novaAba.style.left = '50%';
            novaAba.style.transform = 'translateX(-50%)';
            novaAba.style.background = 'rgba(0, 0, 0, 0.5)';
            novaAba.style.color = '#fff';
            novaAba.style.padding = '10px 20px';
            novaAba.style.borderRadius = '10px';
            novaAba.style.fontFamily = 'Arial, sans-serif';
            novaAba.style.fontSize = '16px';
            novaAba.style.zIndex = '10000';
            novaAba.textContent = `XP: ${XP} / ${XPparaNivel}`;
            document.body.appendChild(novaAba);
        }
    }

    // Atualiza XP inicialmente
    atualizarXP();

    function checarColisao() {
        if (invulneravel) return;
        const inimigos = document.querySelectorAll('.inimigo');
        const PosPersonagem = personagem.getBoundingClientRect();
        inimigos.forEach(inimigo => {
            const PosIn = inimigo.getBoundingClientRect();
            // checa a colisão do personagem com o inimigo
            if (
                PosPersonagem.left < PosIn.right &&
                PosPersonagem.right > PosIn.left &&
                PosPersonagem.top < PosIn.bottom &&
                PosPersonagem.bottom > PosIn.top
            ) {
                vida-= danoI;
                // tempo de invulnerabilidade
                invulneravel = true;
                personagem.style.opacity = '0.5';
                personagem.style.pointerEvents = 'none'; // intangibilidade
                setTimeout(() => {
                    invulneravel = false;
                    personagem.style.opacity = '1';
                    personagem.style.pointerEvents = 'auto';
                }, invulTempo);
                if (vida <= 0) {
                    // morte
                    alert('Game Over!');
                    window.location.reload();
                }
            }
        });
    }

    function moviment() {
        let dx = 0,
            dy = 0;
        if (keys.w) dy -= 1;
        if (keys.s) dy += 1;
        if (keys.a) dx -= 1;
        if (keys.d) dx += 1;
        if (dx !== 0 || dy !== 0) {
            // movimento diagonal sem aceleração extra
            const len = Math.sqrt(dx * dx + dy * dy);
            dx /= len;
            dy /= len;
            posX += dx * speed;
            posY += dy * speed;
            // Limites
            posX = Math.max(0, Math.min(window.innerWidth - 50, posX));
            posY = Math.max(0, Math.min(window.innerHeight - 50, posY));
            personagem.style.left = posX + 'px';
            personagem.style.top = posY + 'px';
            personagem.textContent = vida;
        }
        checarColisao();
        requestAnimationFrame(moviment);
    }
    moviment();

    window.addEventListener('keydown', e => {
        if (e.key in keys) keys[e.key] = true;
    });
    window.addEventListener('keyup', e => {
        if (e.key in keys) keys[e.key] = false;
    });

    

    // Timer regressivo centralizado no topo
    let tempoRestante = 5 * 60; // 5 minutos
    const timerDiv = document.createElement('div');
    timerDiv.style.position = 'fixed';
    timerDiv.style.left = '50%';
    timerDiv.style.top = '40px';
    timerDiv.style.transform = 'translateX(-50%)';
    timerDiv.style.color = '#fff';
    timerDiv.style.fontSize = '2em';
    timerDiv.style.fontFamily = 'monospace';
    timerDiv.style.background = 'rgba(0,0,0,0.5)';
    timerDiv.style.padding = '8px 18px';
    timerDiv.style.borderRadius = '10px';
    timerDiv.style.zIndex = '9999';
    document.body.appendChild(timerDiv);

    function atualizarTimer() {
        let min = Math.floor(tempoRestante / 60);
        let seg = tempoRestante % 60;
        timerDiv.textContent = `${min.toString().padStart(2, '0')}:${seg.toString().padStart(2, '0')}`;
        if(timerDiv.textContent === '04:00' || timerDiv.textContent === '03:00' || timerDiv.textContent === '02:00' ){
            let reliquia = Math.floor(Math.random() *3);
            switch(reliquia){
                case 0:
                    alert('Você encontrou a Relíquia do tempo! avance 30 segundos.');
                    tempoRestante -= 30;
                    break;
                case 1:
                    alert('Você encontrou a Relíquia da experiência! Xp para subir de nível necessário dividido por 2.');
                    XPparaNivel = Math.floor(XPparaNivel / 2);
                    atualizarXP();
                    break;
                case 2:
                    alert('Você encontrou a Relíquia do sacerdore! Inimigos agora demoram 10% mais para nascer.');
                    intervalo += intervalo / 10;
                    break;
            }
        }

        if (tempoRestante > 0) {
            tempoRestante--;
            setTimeout(atualizarTimer, 1000);
        } else {
            timerDiv.textContent = '00:00';
            alert('Parabéns! Você sobreviveu!');
            window.location.reload();
        }
    }
    atualizarTimer();

    

    // inimigo
    function spawnInimigo() {
        const inimigo = document.createElement('div');
        inimigo.dataset.vida = vidamaxInimigo; // vida individual do inimigo
        inimigo.className = 'inimigo';
        inimigo.style.width = '40px';
        inimigo.style.height = '40px';
        inimigo.style.background = 'rgba(255, 0, 0, 1)';
        inimigo.style.borderRadius = '10px';
        inimigo.style.position = 'absolute';
        inimigo.textContent = vidamaxInimigo;
        inimigo.style.display = 'flex';
        inimigo.style.justifyContent = 'center';
        inimigo.style.alignItems = 'center';
        inimigo.style.fontFamily = 'Arial, sans-serif';
        inimigo.style.fontSize = '18px';
        inimigo.style.color = '#cfcfcfff';

        // Posição aleatória
        inimigo.style.left = Math.random() * (window.innerWidth - 40) + 'px';
        inimigo.style.top = Math.random() * (window.innerHeight - 40) + 'px';
        container.appendChild(inimigo);
        // intervalo de geração de inimigos, diminui toda vez que um inimigo nasce
        let inimigos =  document.querySelectorAll('.inimigo');
        setInterval(() => {intervalo -= (intervalo - inimigos.length)/50}, intervalo);
    }

    if(timerDiv.textContent === '05:00'){
        desafio = Math.floor(Math.random() * 5);
        switch(desafio){
            case 0:
                alert('Você encontrou a Relíquia do desafio! inimigos agora causam o triplo de dano, tem o dobro de vida,e aparecem 4x mais rápido, mas dropam 4x mais XP, são mais lentos, e o tempo está pela metade');
                vidamaxInimigo *= 2;
                velInimigo /= 2;
                dropXP *= 4;
                tempoRestante = 2.5 * 60;
                danoI *= 3;
                debuff = 4;
                break;
            default:
                break;
        }
    }


    
    let intervalo = 4000 / debuff;
    setInterval(spawnInimigo, intervalo);
    

    // inimigos seguindo o personagem
    function moverInimigos() {
        const inimigos = document.querySelectorAll('.inimigo');
        inimigos.forEach(inimigo => {
            let inimigoX = parseFloat(inimigo.style.left);
            let inimigoY = parseFloat(inimigo.style.top);
            let alvoX = posX;
            let alvoY = posY;
            let dx = alvoX - inimigoX;
            let dy = alvoY - inimigoY;
            let dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 1) {
                dx /= dist;
                dy /= dist;
                inimigoX += dx * velInimigo;
                inimigoY += dy * velInimigo;
                inimigo.style.left = inimigoX + 'px';
                inimigo.style.top = inimigoY + 'px';
            }
        });
        requestAnimationFrame(moverInimigos);
    }
    moverInimigos();

    
    //aumenta os stats dos inimigos com o tempo

    function promoverInimigo(){
        vidamaxInimigo += 1;
        velInimigo +=0.5;
        danoI += 1;
        vidaInimigo = vidamaxInimigo;
    }
    setInterval(promoverInimigo, 60000); // aumenta a dificuldade a cada 60 segundos

    function atirar(e) {
        if (!podeAtirar) return;
        podeAtirar = false;

        const tiro = document.createElement('div');
        tiro.className = 'tiro';
        tiro.style.width = '10px';
        tiro.style.height = '10px';
        tiro.style.background = '#ff0';
        tiro.style.borderRadius = '50%';
        tiro.style.position = 'absolute';
        tiro.style.left = posX + 20 + 'px';
        tiro.style.top = posY + 20 + 'px';
        container.appendChild(tiro);

        let tiroX = posX + 20;
        let tiroY = posY + 20;

        const mouseX = e.clientX;
        const mouseY = e.clientY;

        let dx = mouseX - tiroX;
        let dy = mouseY - tiroY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        dx /= dist;
        dy /= dist;

        const velTiro = 8;

        let perfTiro = perf;

        // Array para inimigos já atingidos por este tiro
        let inimigosAtingidos = [];

        function dTiro() {
            tiroX += dx * velTiro;
            tiroY += dy * velTiro;
            tiro.style.left = tiroX + 'px';
            tiro.style.top = tiroY + 'px';

            const inimigos = document.querySelectorAll('.inimigo');
            for (let i = 0; i < inimigos.length; i++) {
                const inimigo = inimigos[i];
                const posTiro = tiro.getBoundingClientRect();
                const posInimigo = inimigo.getBoundingClientRect();

                const colide =
                    posTiro.left < posInimigo.right &&
                    posTiro.right > posInimigo.left &&
                    posTiro.top < posInimigo.bottom &&
                    posTiro.bottom > posInimigo.top;

                if (colide && !inimigosAtingidos.includes(inimigo)) {
                    inimigosAtingidos.push(inimigo);

                    let vidaInimigoAtual = parseInt(inimigo.dataset.vida);
                    vidaInimigoAtual -= dmg;

                    if (vidaInimigoAtual <= 0) {
                        inimigo.remove();
                        XP += Math.floor(Math.random() * 3) + dropXP;
                        atualizarXP();  // Atualiza XP na tela
                        subirNivel();   // Verifica se sobe de nível
                        // Cura o personagem com base no roubo de vida
                        if (vida < vidamax) {
                            vida += parseFloat(Math.random().toFixed(1) * HProubo.toFixed(1));
                            if (vida > vidamax) vida = vidamax; // não ultrapassa a vida máxima
                            personagem.textContent = vida; // Atualiza a vida exibida
                        }
                    } else {
                        inimigo.dataset.vida = vidaInimigoAtual;
                        inimigo.textContent = vidaInimigoAtual;
                    }

                    perfTiro--;

                    if (perfTiro <= 0) {
                        tiro.remove();
                        return;
                    }
                }
            }

            // Remove o tiro se sair da tela
            if (
                tiroX < 0 ||
                tiroX > window.innerWidth ||
                tiroY < 0 ||
                tiroY > window.innerHeight
            ) {
                tiro.remove();
                return;
            }

            // Limpar inimigos atingidos para permitir dano novo quando sair do inimigo
            inimigosAtingidos = inimigosAtingidos.filter(inimigo => {
                const posInimigo = inimigo.getBoundingClientRect();
                const posTiro = tiro.getBoundingClientRect();
                return (
                    posTiro.left < posInimigo.right &&
                    posTiro.right > posInimigo.left &&
                    posTiro.top < posInimigo.bottom &&
                    posTiro.bottom > posInimigo.top
                );
            });

            requestAnimationFrame(dTiro);
        }

        dTiro();

        setTimeout(() => {podeAtirar = true;}, intAtirar);
    }
    window.addEventListener('click', atirar);

    function subirNivel() {
        if (XP >= XPparaNivel) {
            XP = 0;
            XPparaNivel = Math.floor(XPparaNivel * 1.5); // aumenta a XP necessária para o próximo nível
            let randomizar = Math.floor(Math.random() * 12);
            if(vida < vidamax){
                vida += recover;
            }
            if (vida > vidamax) {
                vida = vidamax;
            }

            switch (randomizar) {
                case 0:
                    vidamax++;
                    vida++;
                    alert('Vida máxima aumentada em 1! Vida atual: ' + vidamax);
                    break;
                case 1:
                    dmg++;
                    alert('Dano aumentado em 1! Dano atual: ' + dmg);
                    break;
                case 2:
                    perf++;
                    alert('Perfuração aumentada em 1! Perfuração atual: ' + perf);
                    break;
                case 3:
                    speed += 0.5;
                    speed = parseFloat(speed.toFixed(1));
                    alert('Velocidade aumentada em 0.5! Velocidade atual: ' + speed);
                    break;
                case 4:
                    if (velInimigo > 0.5){
                        velInimigo -= 0.2;
                        velInimigo = parseFloat(velInimigo.toFixed(1));
                        alert('Velocidade inimiga diminuída em 0.2! Velocidade inimiga atual: ' +velInimigo);
                    }else{
                        alert('Velocidade inimiga já está no mínimo!');
                    }
                    break;
                case 5:
                    intAtirar -= intAtirar / 10;
                    intAtirar = parseFloat(intAtirar.toFixed(1));
                    alert(
                        'Intervalo de tiro diminuído em 10%! Intervalo atual: ' +intAtirar +'ms'
                        );
                    break;
                case 6:
                    invulTempo += invulTempo / 10;
                    invulTempo = parseFloat(invulTempo.toFixed(1));
                    alert('Tempo de invulnerabilidade aumentado em 10%! Tempo atual: ' + invulTempo +'ms');
                    break;
                case 7:
                    if (vidamaxInimigo > 1){
                        vidamaxInimigo--;
                        alert('Vida máxima dos inimigos diminuida em 1! Vida inimigos atual: ' + vidamaxInimigo);
                        break;
                    }else{
                        alert('Vida máxima dos inimigos já está no mínimo!');
                        break;
                    }
                case 8:
                    dropXP++;
                    alert('XP drop aumentada em 1! XP drop atual: ' + dropXP);
                    break;
                case 9:
                    recover += 0.5;
                    recover = parseFloat(recover.toFixed(1));
                    alert('Vida recuperada ao subir de nível aumentada em 0.5! Vida recuperada: ' + recover);
                    break;
                case 10:
                    HProubo += 0.2;
                    HProubo = parseFloat(HProubo.toFixed(1));
                    alert('Roubo de Vida aumentado em 0.2! Roubo de vida: ' + HProubo);
                    break;
                case 11:
                    if (danoI > 1){
                        danoI--;
                        alert('Dano inimigo diminuído em 1! Dano inimigo atual: ' + danoI);
                    }else{
                        alert('Dano inimigo já está no mínimo!');
                    }
            }
            atualizarXP();
        }
    }
}
