// words.js — listas de palavras válidas por idioma
// Todas as palavras têm exatamente 5 letras, sem acentos nem caracteres especiais.
// O .filter ao final de cada lista é uma rede de segurança contra erros de digitação.

export const WORDS = {

  // ─── Português (europeu e brasileiro) ────────────────────────────────────
  pt: [
    // originais
    'CARRO', 'PEDRA', 'FOLHA', 'BANCO', 'CAMPO',
    'PORTA', 'LIVRO', 'MARCO', 'PAUSA', 'FUNDO',
    'TERRA', 'PRAIA', 'VERDE', 'NOITE', 'PRATO',
    'BRACO', 'CHAVE', 'FORCA', 'MUNDO', 'SABOR',

    // A
    'ABRIR', 'AGORA', 'AINDA', 'ALUNO', 'AMIGO',
    'ANTES', 'AREIA', 'ARROZ',

    // B
    'BAIXO', 'BEIJO', 'BILHA', 'BLOCO', 'BOCAL',
    'BOLSA', 'BOMBA', 'BORDA', 'BRAVO', 'BREVE',
    'BRIGA', 'BRUXA', 'BURRO',

    // C
    'CABRA', 'CACAU', 'CAIXA', 'CALMA', 'CALOR',
    'CANTO', 'CARTA', 'CAUSA', 'CERTO', 'CHUVA',
    'CINCO', 'CINZA', 'CIRCO', 'COBRA', 'COISA',
    'CONTA', 'COPAS', 'CORDA', 'CORPO', 'CORTE',
    'CORVO', 'COSTA', 'COURO', 'CRIME', 'CRUEL',
    'CUECA', 'CURSO', 'CURTO',

    // D
    'DENSO', 'DIABO', 'DIZER', 'DOBRA', 'DRAMA',
    'DUPLO',

    // E
    'ENTRE', 'ERRAR', 'ETAPA', 'EXAME', 'EXTRA',

    // F
    'FALAR', 'FALSO', 'FARDO', 'FAVOR', 'FAZER',
    'FEBRE', 'FESTA', 'FIBRA', 'FILHO', 'FILME',
    'FIRME', 'FLOCO', 'FLORA', 'FLUXO', 'FOICE',
    'FONTE', 'FORMA', 'FORTE', 'FOSSO', 'FRACO',
    'FRASE', 'FRETE', 'FRUTO', 'FUGIR', 'FUMAR',
    'FURTO',

    // G
    'GANHO', 'GARFO', 'GARRA', 'GASTO', 'GENIO',
    'GERAL', 'GESTO', 'GIRAR', 'GLOBO', 'GOLPE',
    'GORDO', 'GRADE', 'GRAMA', 'GREVE', 'GRIPE',
    'GRITO', 'GRUPO', 'GUETO',

    // H
    'HUMOR',

    // I
    'IDEAL', 'IRMAO',

    // J
    'JOGAR', 'JOVEM', 'JUNTA', 'JURAR', 'JUNTO',

    // L
    'LANCE', 'LARGO', 'LAVAR', 'LEITE', 'LENTO',
    'LICAO', 'LIDER', 'LIMAO', 'LIMPO', 'LISTA',
    'LOCAL', 'LONGE', 'LUTAR',

    // M
    'MAGRO', 'MAIOR', 'MANSO', 'MANTA', 'MASSA',
    'MATAR', 'MEDIR', 'MENOR', 'MENTE', 'METAL',
    'METER', 'MIOLO', 'MOEDA', 'MOLHO', 'MONTE',
    'MORTO', 'MOSCA', 'MOTOR', 'MUITO', 'MULTA',
    'MUSGO',

    // N
    'NARIZ', 'NATAL', 'NAVIO', 'NEGRO', 'NERVO',
    'NINHO', 'NIVEL', 'NORTE', 'NUVEM',

    // O
    'OBRAS', 'OBESO', 'OESTE', 'OLHAR', 'ORDEM',
    'OVINO',

    // P
    'PADRE', 'PALCO', 'PALHA', 'PAPEL', 'PASSO',
    'PEGAR', 'PEIXE', 'PERDA', 'PERTO', 'PIANO',
    'PILHA', 'PINGA', 'PINGO', 'PISTA', 'PLANO',
    'PLENO', 'PODER', 'POEMA', 'POLVO', 'POMBA',
    'PONTO', 'PORCA', 'POSTO', 'PRATA', 'PRAZO',
    'PREGO', 'PRETO', 'PRIMA', 'PRIMO', 'PROVA',
    'PULSO',

    // Q
    'QUEDA',

    // R
    'RADIO', 'RAIVA', 'RAPAZ', 'RASGO', 'RAZAO',
    'RECUO', 'REGRA', 'REINO', 'RENDA', 'RESTO',
    'RITMO', 'RIVAL', 'ROCHA', 'RONCO', 'ROSCA',
    'ROSTO', 'ROUPA', 'RUIDO', 'RUIVO',

    // S
    'SABIA', 'SAFRA', 'SALTO', 'SANTO', 'SAUDE',
    'SECAR', 'SELVA', 'SENSO', 'SENHA', 'SERVO',
    'SIGLA', 'SITIO', 'SOBRE', 'SOGRA', 'SOGRO',
    'SOLTO', 'SORTE', 'SUAVE', 'SUBIR', 'SUMIR',
    'SURDO', 'SURTO',

    // T
    'TALCO', 'TANGO', 'TANTO', 'TARDE', 'TEMER',
    'TEMPO', 'TENDA', 'TERNO', 'TIGRE', 'TINTO',
    'TIRAR', 'TOCHA', 'TOMBO', 'TONTO', 'TORTA',
    'TORTO', 'TOSCO', 'TOSSE', 'TOTAL', 'TOURO',
    'TRATO', 'TREVO', 'TRIBO', 'TRIGO', 'TROCO',
    'TROPA', 'TUMOR', 'TURNO',

    // V
    'VAGAR', 'VALOR', 'VAPOR', 'VAZIO', 'VEADO',
    'VENDA', 'VENTO', 'VERBO', 'VERSO', 'VIDRO',
    'VIGOR', 'VIRAR', 'VISAO', 'VISTA', 'VITAL',
    'VOTAR', 'VULTO',

    // Z
    'ZEBRA', 'ZINCO',
  ].filter(w => w.length === 5),


  // ─── Nederlands ──────────────────────────────────────────────────────────
  nl: [
    // originais
    'FIETS', 'WATER', 'BROOD', 'TAFEL', 'STOEL',
    'LUCHT', 'BRIEF', 'BLOEM', 'KLEUR', 'NACHT',
    'GROEN', 'ZWART', 'REGEN', 'STORM', 'BOMEN',
    'KAART', 'DROOM', 'TREIN', 'HEMEL', 'ZOMER',

    // A
    'AARDE', 'APPEL', 'AVOND',

    // B
    'BEKER', 'BEURT', 'BEVER', 'BLAUW', 'BLEEK',
    'BLIND', 'BLOED', 'BODEM', 'BORST', 'BOTER',
    'BOVEN', 'BRAND', 'BREED', 'BRIES', 'BRUIN',
    'BUURT',

    // D
    'DATUM', 'DEKEN', 'DERDE', 'DICHT', 'DODEN',
    'DRUIF', 'DUWEN',

    // E
    'EERST', 'EIGEN', 'EINDE', 'ENKEL', 'ERNST',

    // F
    'FEEST', 'FLUIT', 'FOREL', 'FRIET',

    // G
    'GELUK', 'GEVEN', 'GEZIN', 'GEWAS', 'GRAAF',
    'GRAAG', 'GRAAN', 'GRENS', 'GRIJS', 'GROND',
    'GROEP', 'GROET', 'GROOT',

    // H
    'HAAST', 'HAVEN', 'HEIDE', 'HITTE', 'HOEFT',
    'HOOFD', 'HOREN', 'HOTEL', 'HUMOR',

    // I
    'IEDER',

    // J
    'JAGER', 'JARIG', 'JUIST',

    // K
    'KABEL', 'KAMER', 'KEUZE', 'KLAAR', 'KLANK',
    'KLEED', 'KLEIN', 'KLOMP', 'KNOOP', 'KOERS',
    'KOPEN', 'KOPJE', 'KORST',

    // L
    'LAARS', 'LAKEN', 'LATEN', 'LEGER', 'LENTE',
    'LEPEL', 'LEVEN', 'LEZEN', 'LICHT', 'LINKS',
    'LOPEN', 'LUNCH',

    // M
    'MAAND', 'MACHT', 'MAGER', 'MATCH', 'METEN',
    'MOORD',

    // N
    'NAALD', 'NABIJ', 'NEMEN', 'NETTO', 'NIEUW',
    'NODIG',

    // O
    'OEVER', 'OOGST',

    // P
    'PAARD', 'PEPER', 'PRIJS',

    // R
    'RADAR', 'RADIO', 'RECHT', 'REDEN', 'REGEL',
    'RENTE',

    // S
    'SAMEN', 'SFEER', 'SJAAL', 'SLAAP', 'SLAAN',
    'SLANG', 'SLOOT', 'SMART', 'SMAAK', 'SNAAR',
    'SOORT', 'SPEEL', 'SPOOR', 'SPORT', 'STAAN',
    'STAAL', 'START', 'STEEK', 'STEEN', 'STEIL',
    'STERN', 'STEUN', 'STIJL', 'STOEP', 'STRAF',
    'STRIP', 'STUUR',

    // T
    'TAART', 'TAKEN', 'TEKEN', 'THEMA', 'TOCHT',
    'TONEN', 'TOREN', 'TROTS', 'TRUCK',

    // U
    'UITEN',

    // V
    'VAREN', 'VASTE', 'VEGEN', 'VERRE', 'VLEES',
    'VLOER', 'VLOOT', 'VOGEL', 'VRAAG', 'VREDE',
    'VREES', 'VROUW', 'VUIST',

    // W
    'WACHT', 'WEGEN', 'WERKT', 'WETEN', 'WEZEN',
    'WIJZE', 'WITTE', 'WOEDE', 'WOORD', 'WREED',

    // Z
    'ZACHT', 'ZADEL', 'ZEBRA', 'ZEKER', 'ZEVEN',
    'ZINGT', 'ZOEKT', 'ZONDE', 'ZUCHT', 'ZULKE',
    'ZWEET', 'ZWIJN',
  ].filter(w => w.length === 5),

};
