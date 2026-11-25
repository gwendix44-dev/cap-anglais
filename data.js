/* Contenu pédagogique — généré à l'avance, fonctionne hors ligne.
   Convention : pour les QCM, la 1re option est la bonne (mélangée à l'affichage). */
(function () {
  const M = (q, o, exp, tag = 'gram') => ({ type: 'mcq', q, opts: o, exp, tag });
  const T = (q, ans, exp, tag = 'gram') => ({ type: 'type', q, ans: [].concat(ans), exp, tag });
  const O = (fr, en, exp, tag = 'gram') => ({ type: 'order', fr, en, exp, tag });
  const X = (pairs, tag = 'vocab') => ({ type: 'match', pairs, tag, exp: '' });
  const L = (lvl, skill, q, o, exp, ctx) => ({ type: 'mcq', lvl, skill, tag: skill, q, opts: o, exp, ctx });
  const R = (title, text, qs) => ({ title, text, q: qs.map(([q, o, exp]) => ({ type: 'mcq', q, opts: o, exp: exp || '', tag: 'read', ctx: text })) });

  /* ---------- Test de niveau : 10 questions par niveau (1=A1 … 5=C1) ---------- */
  const test = [
    L(1, 'gram', 'She ___ a teacher.', ['is', 'are', 'am', 'be'], 'Avec she / he / it, on utilise « is ».'),
    L(1, 'gram', 'I ___ coffee every morning.', ['drink', 'drinks', 'drinking'], 'Avec « I », le verbe reste à la forme de base, sans -s.'),
    L(1, 'vocab', '« A ticket » veut dire…', ['un billet', 'une valise', 'un passeport', 'un siège'], 'ticket = billet.'),
    L(1, 'gram', 'There ___ two bags on the table.', ['are', 'is', 'am'], 'Pluriel (two bags) → « are ».'),
    L(1, 'gram', '___ you speak English?', ['Do', 'Does', 'Are', 'Is'], 'Question au présent simple avec « you » → « Do ».'),
    L(1, 'vocab', '« Luggage » veut dire…', ['bagages', 'voyage', 'vol', 'billet'], 'luggage = bagages.'),
    L(1, 'gram', 'He ___ to work by train.', ['goes', 'go', 'going', 'is go'], 'Avec he / she / it, on ajoute -s (-es après o) : goes.'),
    L(1, 'gram', 'I have ___ apple.', ['an', 'a', 'some'], '« an » devant une voyelle : an apple.'),
    L(1, 'read', 'Where does Tom live?', ['In London', 'In Spain', 'In Madrid'], 'Tom is from Spain, but he lives in London.', 'Hello, my name is Tom. I am from Spain. I live in London.'),
    L(1, 'gram', 'My brother and I ___ students.', ['are', 'is', 'am'], '« My brother and I » = we → are.'),

    L(2, 'gram', 'Yesterday I ___ to the cinema.', ['went', 'go', 'goed', 'gone'], 'Passé simple irrégulier : go → went.'),
    L(2, 'gram', "I'm ___ a book at the moment.", ['reading', 'read', 'reads'], '« At the moment » → présent continu : be + verbe-ing.'),
    L(2, 'gram', 'She is taller ___ her sister.', ['than', 'that', 'then', 'as'], 'Comparatif : taller than.'),
    L(2, 'gram', 'How ___ water do you drink a day?', ['much', 'many', 'long'], 'water est indénombrable → how much.'),
    L(2, 'gram', 'We ___ dinner when the phone rang.', ['were having', 'had', 'have'], 'Action en cours interrompue par une autre → passé continu.'),
    L(2, 'vocab', '« Departure » veut dire…', ['départ', 'arrivée', 'retard', 'escale'], 'departure = départ.'),
    L(2, 'gram', "I haven't got ___ money.", ['any', 'some', 'a'], 'À la forme négative, on utilise « any ».'),
    L(2, 'gram', 'You ___ smoke here. It is forbidden.', ['mustn\'t', 'don\'t have to', 'might not'], '« mustn\'t » = interdiction. « Don\'t have to » = pas obligé.'),
    L(2, 'read', 'Can you shop there on Sunday?', ['No, it is closed', 'Yes, from 9 to 6', 'Only in the morning'], 'On Sundays it is closed.', 'The shop opens at 9 a.m. and closes at 6 p.m. On Sundays it is closed.'),
    L(2, 'gram', 'She is going to ___ a new job next month.', ['start', 'starts', 'started'], '« be going to » + verbe à la forme de base.'),

    L(3, 'gram', 'If it rains tomorrow, we ___ at home.', ['will stay', 'would stay', 'stayed'], 'Condition réelle (if + présent) → will + verbe.'),
    L(3, 'gram', 'I have lived here ___ 2019.', ['since', 'for', 'from', 'during'], '« Since » + point de départ (2019). « For » + durée.'),
    L(3, 'gram', 'She asked me where ___.', ['I lived', 'did I live', 'I did live', 'do I live'], 'Discours indirect : ordre sujet + verbe, pas d\'inversion.'),
    L(3, 'gram', 'The report ___ by the manager yesterday.', ['was written', 'wrote', 'has written', 'is written'], 'Passif au passé : was + participe passé.'),
    L(3, 'gram', 'He suggested ___ a taxi.', ['taking', 'to take', 'take'], '« suggest » est suivi de -ing.'),
    L(3, 'vocab', '« To postpone a meeting » veut dire…', ['reporter une réunion', 'annuler une réunion', 'avancer une réunion', 'confirmer une réunion'], 'postpone = reporter, repousser.'),
    L(3, 'gram', 'You had ___ see a doctor.', ['better', 'best', 'good'], '« had better » + verbe = il vaudrait mieux.'),
    L(3, 'gram', 'I wish I ___ more time.', ['had', 'have', 'would have', 'has'], 'Regret au présent : I wish + prétérit.'),
    L(3, 'read', 'What does the sender ask?', ['The arrival time', 'The payment', 'The room number', 'If breakfast is wanted'], '« Please let us know your arrival time ».', 'Dear Mr Lee, I am writing to confirm your reservation for two nights from 12 to 14 May. Breakfast is included. Please let us know your arrival time.'),
    L(3, 'gram', 'He is used to ___ early.', ['getting up', 'get up', 'got up'], '« be used to » + verbe-ing (être habitué à).'),

    L(4, 'gram', 'Had I known about the delay, I ___ earlier.', ['would have left', 'would leave', 'had left', 'will leave'], '3e conditionnel inversé : Had I known = If I had known.'),
    L(4, 'gram', 'The flight was cancelled, ___ caused major disruption.', ['which', 'what', 'that', 'it'], '« which » reprend toute la proposition précédente.'),
    L(4, 'gram', 'He denied ___ the contract.', ['signing', 'to sign', 'sign'], '« deny » est suivi de -ing.'),
    L(4, 'vocab', 'A « layover » is…', ['une escale', 'un surclassement', 'une consigne', 'un retard'], 'layover = escale.'),
    L(4, 'gram', 'Not only ___ late, but he also forgot the documents.', ['was he', 'he was', 'did he be', 'he is'], 'Après « Not only » en début de phrase, on inverse sujet et verbe.'),
    L(4, 'gram', 'By next year, we ___ the new terminal.', ['will have completed', 'will complete', 'are completing', 'complete'], 'Futur antérieur : action terminée avant un moment futur.'),
    L(4, 'gram', 'Despite ___ tired, she kept working.', ['being', 'to be', 'she was'], '« Despite » + verbe-ing.'),
    L(4, 'vocab', '« To cater to special requests » veut dire…', ['répondre aux demandes particulières', 'ignorer les demandes', 'refuser les demandes', 'annuler les demandes'], 'cater to = répondre aux besoins de.'),
    L(4, 'read', 'What is true?', ['The lounge cannot be used for now', 'The lounge has moved to level 2', 'The lounge is open to all', 'The works are finished'], '« Closed until further notice » : fermé jusqu\'à nouvel ordre.', 'Passengers are reminded that the lounge will be closed for refurbishment until further notice. Alternative facilities are available on level 2.'),
    L(4, 'gram', 'The more you practise, ___ you become.', ['the better', 'better', 'the best', 'more better'], 'Structure « the + comparatif, the + comparatif ».'),

    L(5, 'gram', 'Seldom ___ such a professional service.', ['have I seen', 'I have seen', 'did I saw', 'I saw'], 'Adverbe négatif en début de phrase → inversion.'),
    L(5, 'gram', 'The proposal, ___ details were confidential, was rejected.', ['whose', 'which', 'that', 'who'], '« whose » exprime la possession (dont les détails).'),
    L(5, 'vocab', 'A « stopgap measure » is…', ['une solution provisoire', 'une mesure radicale', 'une économie', 'une sanction'], 'stopgap = palliatif, solution temporaire.'),
    L(5, 'gram', "It's high time we ___ the procedure.", ['reviewed', 'review', 'will review', 'have to review'], '« It\'s high time » + prétérit.'),
    L(5, 'gram', 'She would have attended, ___ she not been ill.', ['had', 'if', 'were', 'would'], 'Inversion : Had she not been = If she had not been.'),
    L(5, 'vocab', '« To expedite » veut dire…', ['accélérer', 'retarder', 'vérifier', 'annuler'], 'expedite = accélérer le traitement de.'),
    L(5, 'gram', 'Hardly had we landed ___ the storm began.', ['when', 'than', 'that', 'as soon'], '« Hardly … when ».'),
    L(5, 'gram', 'Were the flight to be delayed, passengers ___ compensated.', ['would be', 'will be', 'had been', 'are'], 'Condition inversée (Were … = If the flight were …) → would.'),
    L(5, 'read', 'The airline…', ['admitted the problem but refused to pay', 'apologised and paid', 'denied there was a problem', 'offered a refund'], '« Stopped short of offering compensation » = n\'est pas allée jusqu\'à indemniser.', 'While the airline acknowledged the inconvenience, it stopped short of offering compensation, citing "extraordinary circumstances".'),
    L(5, 'gram', "I can't help ___ that the schedule is unrealistic.", ['feeling', 'to feel', 'feel'], '« can\'t help » + verbe-ing.')
  ];

  /* ---------- Chapitres ---------- */
  const chapters = [
    {
      id: 1, title: 'Vie quotidienne', sub: 'Routines, présent simple et continu', lvl: 'A1–A2',
      lesson: {
        points: [
          'Présent simple : les habitudes. I work, you work, she works (on ajoute -s à he / she / it).',
          'Présent continu : ce qui se passe maintenant. I am working, she is working.',
          'Questions : Do you work ? Does she work ? Pas de -s sur le verbe après does.'
        ],
        phrases: [
          ['What do you do for a living?', 'Que faites-vous dans la vie ?'],
          ['I get up at seven every day.', 'Je me lève à sept heures tous les jours.'],
          ['Could you repeat that, please?', 'Pouvez-vous répéter, s\'il vous plaît ?'],
          ['Sorry, I didn\'t understand.', 'Désolé, je n\'ai pas compris.'],
          ['Can you speak more slowly?', 'Pouvez-vous parler plus lentement ?'],
          ['How do you spell that?', 'Comment ça s\'écrit ?']
        ]
      },
      ex: [
        M('She ___ up at six every day.', ['gets', 'get', 'is getting'], 'Habitude + she → gets.'),
        M('Look! It ___ now.', ['is raining', 'rains', 'rain'], '« Look! » + maintenant → présent continu.'),
        M('___ he work on Saturdays?', ['Does', 'Do', 'Is'], 'Question avec he → Does.'),
        O('Je ne mange pas de viande.', "I don't eat meat", 'Négation : don\'t + verbe de base.'),
        T('He ___ (watch) TV every evening.', 'watches', 'Les verbes en -ch prennent -es : watches.'),
        M('I ___ breakfast at 8.', ['have', 'has', 'am have'], 'Avec « I » : have.'),
        X([['wake up', 'se réveiller'], ['cook', 'cuisiner'], ['neighbour', 'voisin'], ['groceries', 'courses']]),
        M('My sister ___ in Paris.', ['lives', 'live', 'is live'], 'Sujet singulier → lives.'),
        O('Que faites-vous dans la vie ?', 'What do you do for a living', 'Question de base à connaître par cœur.'),
        M('I usually ___ to work by bus.', ['go', 'goes', 'going'], 'Avec « I » : go.')
      ],
      reading: R('Une journée d\'Emma', 'Emma is a nurse in Leeds. She gets up at 5:30 and starts work at 7. She has lunch at noon in the hospital café. In the evening she often cooks with her flatmate, Sam. At weekends she plays tennis.', [
        ['What time does Emma start work?', ['At 7', 'At 5:30', 'At noon'], 'She gets up at 5:30, she starts work at 7.'],
        ['Where does she have lunch?', ['In the hospital café', 'At home', 'With Sam']],
        ['What does she do at weekends?', ['She plays tennis', 'She cooks', 'She works']]
      ])
    },
    {
      id: 2, title: 'Voyage & aéroport', sub: 'Passé simple, prépositions, se repérer', lvl: 'A2',
      lesson: {
        points: [
          'Passé simple : action terminée. Verbes réguliers + -ed (arrived), irréguliers à connaître (went, bought, flew).',
          'Prépositions : at + heure / lieu précis (at 6, at the airport), on + jour (on Monday), in + ville / mois (in Rome, in May).',
          'Pour demander poliment : Could you tell me…? Excuse me, where is…?'
        ],
        phrases: [
          ['I\'d like to check in, please.', 'Je voudrais enregistrer mes bagages.'],
          ['Where is gate 12?', 'Où est la porte 12 ?'],
          ['My flight is delayed.', 'Mon vol est retardé.'],
          ['Is this seat taken?', 'Cette place est-elle prise ?'],
          ['Where are you from? How long are you staying?', 'D\'où venez-vous ? Combien de temps restez-vous ?'],
          ['Could you tell me how to get to the station?', 'Pouvez-vous m\'indiquer comment aller à la gare ?']
        ]
      },
      ex: [
        M('We ___ at the airport two hours before the flight.', ['arrived', 'arrive', 'were arrive'], 'Action terminée → passé simple : arrived.'),
        M("I'm flying ___ Paris to London.", ['from', 'at', 'in'], 'from … to … : de … à ….'),
        M('The flight leaves ___ Monday.', ['on', 'at', 'in'], 'Jour de la semaine → on.'),
        M('Excuse me, where do I ___ in?', ['check', 'look', 'get'], 'check in = s\'enregistrer.', 'vocab'),
        O('Pourriez-vous m\'indiquer où est la porte ?', 'Could you tell me where the gate is', 'Après « Could you tell me », ordre normal : where the gate is.'),
        T('Passé simple de « buy » :', 'bought', 'buy – bought – bought.', 'verbs'),
        X([['boarding pass', 'carte d\'embarquement'], ['gate', 'porte d\'embarquement'], ['delay', 'retard'], ['luggage', 'bagages']]),
        M('Is this seat ___?', ['taken', 'took', 'taking'], 'Participe passé utilisé comme adjectif : taken.'),
        O('D\'où venez-vous ?', 'Where are you from', 'Question d\'introduction très courante.'),
        M('How long ___ you stay in Rome last year?', ['did', 'do', 'were'], 'last year → passé → did.')
      ],
      reading: R('Annonce d\'aéroport', 'Notice: Flight BA304 to Geneva is delayed by 45 minutes. New departure time: 14:15. Passengers should remain near Gate 22. Free water is available at the information desk.', [
        ['What is the new departure time?', ['14:15', '13:30', '14:45']],
        ['Where should passengers stay?', ['Near Gate 22', 'At the information desk', 'In the lounge']],
        ['What is free?', ['Water', 'Coffee', 'Sandwiches']]
      ])
    },
    {
      id: 3, title: 'Accueil & service client', sub: 'Politesse, demandes, réclamations', lvl: 'B1',
      lesson: {
        points: [
          'Politesse : Could / Would / May I… plutôt que « I want » ou un ordre direct.',
          'Refuser avec tact : I\'m afraid that\'s not possible, but I can offer you…',
          'Rassurer : Let me check that for you. I\'ll be right with you. Thank you for your patience.'
        ],
        phrases: [
          ['Welcome. How may I help you?', 'Bienvenue. Comment puis-je vous aider ?'],
          ['May I have your name, please?', 'Puis-je avoir votre nom, s\'il vous plaît ?'],
          ['I\'ll be right with you.', 'Je suis à vous dans un instant.'],
          ['I\'m afraid that\'s not possible.', 'Je crains que ce ne soit pas possible.'],
          ['Is there anything else I can do for you?', 'Puis-je faire autre chose pour vous ?'],
          ['I apologise for the inconvenience.', 'Je vous prie de m\'excuser pour la gêne occasionnée.']
        ]
      },
      ex: [
        M('___ I take your coat, madam?', ['May', 'Must', 'Do'], '« May I… ? » est la forme la plus polie pour proposer.'),
        M('Would you like ___ coffee?', ['some', 'any', 'many'], 'Dans une offre, on utilise « some ».'),
        M('Which sentence is the most polite?', ['Could you spell your name, please?', 'Spell your name.', 'You must spell your name.', 'Tell me your name.'], 'Could you…, please ? = demande polie.'),
        O('Je suis à vous dans un instant.', "I'll be right with you", 'Phrase à dire à un client qui attend.'),
        M("I'm afraid the manager ___ available until 3 p.m.", ["isn't", "doesn't", "hasn't"], '« I\'m afraid » adoucit une mauvaise nouvelle.'),
        T('Thank you for your ____ . (la patience)', 'patience', 'Attention à l\'orthographe : patience.', 'spell'),
        X([['to greet', 'accueillir'], ['complaint', 'réclamation'], ['refund', 'remboursement'], ['appointment', 'rendez-vous']]),
        M('Let me ___ that for you.', ['check', 'to check', 'checking'], '« Let me » + verbe sans to.'),
        O('Puis-je faire autre chose pour vous ?', 'Is there anything else I can do for you', 'Pour clore poliment un échange.'),
        M('The customer is angry. Best answer:', ['I\'m very sorry for the inconvenience. Let me solve this.', 'Calm down.', 'It\'s not my problem.', 'You should have called before.'], 'Excuse + proposition d\'action = bonne réponse de service client.')
      ],
      reading: R('Un client mécontent', 'Hello, I booked a car for 9 a.m. but nobody was at the desk when I arrived. I waited 40 minutes and missed my meeting. I would like a refund. Regards, Mr Dalton', [
        ['What is the problem?', ['Nobody was at the desk', 'The car was dirty', 'The price was wrong']],
        ['How long did he wait?', ['40 minutes', '15 minutes', 'One hour']],
        ['What does he want?', ['A refund', 'A new booking', 'Only an apology']]
      ])
    },
    {
      id: 4, title: 'Travail', sub: 'Present perfect, e-mails, réunions', lvl: 'B1',
      lesson: {
        points: [
          'Present perfect : have / has + participe passé. Lien avec le présent : I have worked here for two years.',
          'for + durée (for two years), since + point de départ (since 2023).',
          'E-mails : formules d\'ouverture et de clôture fixes — apprends-les telles quelles.'
        ],
        phrases: [
          ['I\'m writing to confirm…', 'Je vous écris pour confirmer…'],
          ['Please find attached the document.', 'Veuillez trouver le document ci-joint.'],
          ['I\'ll get back to you by Friday.', 'Je reviens vers vous d\'ici vendredi.'],
          ['Sorry for the late reply.', 'Désolé pour la réponse tardive.'],
          ['I look forward to hearing from you.', 'Dans l\'attente de votre réponse.'],
          ['Let\'s schedule a meeting.', 'Fixons une réunion.']
        ]
      },
      ex: [
        M('I ___ in this company for two years.', ['have worked', 'worked', 'am working'], 'for + durée jusqu\'à maintenant → present perfect.'),
        M('She has been here ___ Monday.', ['since', 'for', 'from'], 'Point de départ → since.'),
        M('I look forward to ___ from you.', ['hearing', 'hear', 'heard'], '« look forward to » + verbe-ing.'),
        O('Veuillez trouver le document ci-joint.', 'Please find the document attached', 'Formule standard des e-mails professionnels.'),
        T('Participe passé de « send » :', 'sent', 'send – sent – sent.', 'verbs'),
        X([['deadline', 'date limite'], ['schedule', 'emploi du temps'], ['to attend', 'assister à'], ['colleague', 'collègue']]),
        M('Have you ___ the report yet?', ['finished', 'finish', 'finishing'], 'have + participe passé.'),
        M("I'll get back ___ you by Friday.", ['to', 'at', 'for'], 'get back to someone = revenir vers quelqu\'un.'),
        O('Désolé pour la réponse tardive.', 'Sorry for the late reply', 'À utiliser souvent en e-mail.'),
        M('We ___ the meeting twice this month.', ['have postponed', 'postpone', 'are postponed'], '« this month » (période non terminée) → present perfect.')
      ],
      reading: R('Un e-mail interne', 'Hi team, the Monday meeting is moved to Tuesday at 10:30 because the client cannot come before. Please bring your figures for May. Lunch will be provided. Thanks, Clara', [
        ['When is the meeting now?', ['Tuesday at 10:30', 'Monday at 10:30', 'Tuesday at noon']],
        ['Why was it moved?', ['The client is not available earlier', 'Clara is ill', 'The room is booked']],
        ['What should the team bring?', ['Figures for May', 'Lunch', 'Nothing']]
      ])
    },
    {
      id: 5, title: 'Jets privés & aviation d\'affaires', sub: 'Vocabulaire métier, conditionnel', lvl: 'B1–B2',
      lesson: {
        points: [
          'Vocabulaire clé : charter (vol affrété), crew (équipage), apron (aire de stationnement), ground handling (assistance au sol), customs (douane), manifest (liste des passagers), tail number (immatriculation).',
          'Condition réelle : If the weather improves, we will depart on time.',
          'Condition hypothétique : If I were you, I would call the captain.'
        ],
        phrases: [
          ['Your aircraft is ready.', 'Votre avion est prêt.'],
          ['The crew is on board.', 'L\'équipage est à bord.'],
          ['We will arrange ground transportation.', 'Nous organiserons le transport au sol.'],
          ['Wheels up at 3 p.m.', 'Décollage à 15 h.'],
          ['Customs clearance will take a few minutes.', 'Le passage en douane prendra quelques minutes.'],
          ['Would you like catering on board?', 'Souhaitez-vous un service de restauration à bord ?']
        ]
      },
      ex: [
        M('A flight booked only for you or your group is a ___ flight.', ['charter', 'scheduled', 'low-cost'], 'charter = vol affrété.', 'vocab'),
        M('The ___ is the area where aircraft park.', ['apron', 'runway', 'lounge'], 'apron = aire de stationnement. Runway = piste.', 'vocab'),
        M('If the weather ___, we will depart on time.', ['improves', 'will improve', 'improved'], 'if + présent, will + verbe.'),
        M('If I ___ you, I would call the captain.', ['were', 'am', 'will be'], 'Hypothèse : if I were you.'),
        X([['crew', 'équipage'], ['to refuel', 'faire le plein'], ['ground handling', 'assistance au sol'], ['customs', 'douane']]),
        O('Votre avion est prêt.', 'Your aircraft is ready', 'Phrase d\'accueil de base en FBO.'),
        T('The pilots and the cabin ____ are on board. (l\'équipage)', 'crew', 'crew = équipage.', 'vocab'),
        M('The passengers will arrive ___ 4 p.m.', ['at', 'in', 'on'], 'Heure précise → at.'),
        O('Nous organiserons le transport au sol.', 'We will arrange ground transportation', 'arrange = organiser.'),
        M('The ___ is the list of all passengers on board.', ['manifest', 'menu', 'ticket'], 'passenger manifest = liste des passagers.', 'vocab')
      ],
      reading: R('Annonce à bord', 'Welcome aboard. Today\'s flight from Le Bourget to Geneva will take about 50 minutes. Refreshments are available in the cabin. Please keep your seat belt fastened during take-off and landing. On arrival, a car will take you to the terminal and customs.', [
        ['How long is the flight?', ['About 50 minutes', 'About 15 minutes', 'Two hours']],
        ['What happens on arrival?', ['A car takes passengers to the terminal', 'Passengers walk to customs', 'Passengers collect a taxi voucher']],
        ['When must the seat belt be fastened?', ['During take-off and landing', 'During the whole flight', 'Never']]
      ])
    },
    {
      id: 6, title: 'FBO : situations réelles', sub: 'Retards, passif, demandes de dernière minute', lvl: 'B2',
      lesson: {
        points: [
          'Annoncer un retard : I\'m afraid there will be a delay of about 30 minutes due to… + We apologise for the inconvenience.',
          'Passif : décrit ce qui est fait pour le client. Your car has been arranged. Your luggage is being loaded.',
          'Demande de dernière minute : We\'ll do our best to accommodate your request. Let me see what we can do.'
        ],
        phrases: [
          ['Welcome, Mr Smith. We\'ve been expecting you.', 'Bienvenue, M. Smith. Nous vous attendions.'],
          ['Your car is waiting outside.', 'Votre voiture vous attend dehors.'],
          ['The departure has been rescheduled to 6 p.m.', 'Le départ a été reprogrammé à 18 h.'],
          ['Due to air traffic control restrictions…', 'En raison de restrictions du contrôle aérien…'],
          ['Would you mind waiting a moment?', 'Voulez-vous bien patienter un instant ?'],
          ['We can accommodate that request.', 'Nous pouvons satisfaire cette demande.']
        ]
      },
      ex: [
        M('Your luggage ___ to the aircraft now.', ['is being taken', 'is taking', 'has take'], 'Passif en cours : is being + participe passé.'),
        M('The departure ___ to 6 p.m.', ['has been rescheduled', 'has rescheduled', 'is rescheduling'], 'Passif : has been + participe passé.'),
        M('There will be a delay ___ air traffic control restrictions.', ['due to', 'because', 'so'], '« due to » + nom ; « because » + proposition.'),
        O('Nous ferons de notre mieux pour répondre à votre demande.', 'We will do our best to accommodate your request', 'Phrase clé pour une demande de dernière minute.'),
        M('Would you mind ___ a moment?', ['waiting', 'to wait', 'wait'], '« Would you mind » + verbe-ing.'),
        T('Your car is _______ outside. (to wait)', 'waiting', 'is + verbe-ing : is waiting.'),
        X([['delay', 'retard'], ['last-minute', 'de dernière minute'], ['to accommodate', 'satisfaire, accueillir'], ['apology', 'excuse']]),
        M('Best way to announce a delay:', ['I\'m afraid your flight will be delayed by about 30 minutes. We apologise for the inconvenience.', 'Your flight is late.', 'There is a problem.', 'Wait here.'], 'Annonce claire + durée + excuse.'),
        O('Votre voiture vous attend dehors.', 'Your car is waiting outside', 'Phrase d\'accueil typique.'),
        M('The aircraft ___ at the moment.', ['is being refuelled', 'is refuel', 'refuels'], 'En ce moment, passif continu : is being refuelled.')
      ],
      reading: R('Un retard au FBO', 'At 5:40 p.m., the crew informs the FBO that Mr Berger\'s flight to Nice will leave 45 minutes late because of a technical check. He has also asked for a vegetarian meal and a taxi on arrival. The customer service agent offers him a seat in the lounge.', [
        ['Why is the flight late?', ['A technical check', 'Bad weather', 'Late passengers']],
        ['What special meal did he ask for?', ['A vegetarian meal', 'A fish meal', 'No meal']],
        ['What does the agent offer?', ['A seat in the lounge', 'A refund', 'A hotel room']]
      ])
    }
  ];

  /* ---------- Verbes irréguliers : base | prétérit | participe | français ---------- */
  const verbsRaw = `be|was/were|been|être
become|became|become|devenir
begin|began|begun|commencer
break|broke|broken|casser
bring|brought|brought|apporter
build|built|built|construire
buy|bought|bought|acheter
catch|caught|caught|attraper
choose|chose|chosen|choisir
come|came|come|venir
cost|cost|cost|coûter
cut|cut|cut|couper
do|did|done|faire
draw|drew|drawn|dessiner
drink|drank|drunk|boire
drive|drove|driven|conduire
eat|ate|eaten|manger
fall|fell|fallen|tomber
feel|felt|felt|ressentir
find|found|found|trouver
fly|flew|flown|voler (avion)
forget|forgot|forgotten|oublier
get|got|got/gotten|obtenir
give|gave|given|donner
go|went|gone/been|aller
grow|grew|grown|grandir
have|had|had|avoir
hear|heard|heard|entendre
hide|hid|hidden|cacher
hold|held|held|tenir
keep|kept|kept|garder
know|knew|known|savoir
lead|led|led|mener
leave|left|left|partir
lend|lent|lent|prêter
let|let|let|laisser
lose|lost|lost|perdre
make|made|made|faire, fabriquer
mean|meant|meant|signifier
meet|met|met|rencontrer
pay|paid|paid|payer
put|put|put|poser
read|read|read|lire
ride|rode|ridden|monter (vélo, cheval)
ring|rang|rung|sonner
run|ran|run|courir
say|said|said|dire
see|saw|seen|voir
sell|sold|sold|vendre
send|sent|sent|envoyer
set|set|set|fixer
show|showed|shown|montrer
shut|shut|shut|fermer
sing|sang|sung|chanter
sit|sat|sat|s'asseoir
sleep|slept|slept|dormir
speak|spoke|spoken|parler
spend|spent|spent|dépenser
stand|stood|stood|être debout
steal|stole|stolen|voler (dérober)
swim|swam|swum|nager
take|took|taken|prendre
teach|taught|taught|enseigner
tell|told|told|raconter, dire
think|thought|thought|penser
throw|threw|thrown|jeter
understand|understood|understood|comprendre
wake|woke|woken|se réveiller
wear|wore|worn|porter (vêtement)
win|won|won|gagner
write|wrote|written|écrire`;
  const verbs = verbsRaw.split('\n').map(l => { const [base, past, pp, fr] = l.split('|'); return { base, past, pp, fr }; });

  /* ---------- Orthographe : bonne forme | faute courante | sens ---------- */
  const spellRaw = `receive|recieve|recevoir
definitely|definately|certainement
separate|seperate|séparer
necessary|neccessary|nécessaire
accommodation|accomodation|hébergement
embarrass|embarass|embarrasser
occasion|ocasion|occasion
tomorrow|tommorow|demain
schedule|shedule|programme
environment|enviroment|environnement
beginning|begining|début
business|bussiness|affaires
calendar|calender|calendrier
colleague|collegue|collègue
foreign|foriegn|étranger
government|goverment|gouvernement
knowledge|knowlege|connaissance
successful|succesful|réussi
Wednesday|Wensday|mercredi
weird|wierd|bizarre
luggage|luggadge|bagages
passenger|pasenger|passager
arrival|arrivel|arrivée
experience|experiance|expérience
recommend|reccomend|recommander
address|adress|adresse
immediately|immediatly|immédiatement
available|avaliable|disponible
interesting|intresting|intéressant
restaurant|restaraunt|restaurant
customer|custumer|client
suitcase|suitecase|valise`;
  const spell = spellRaw.split('\n').map(l => { const [ok, ko, fr] = l.split('|'); return { ok, ko, fr }; });

  /* ---------- Vocabulaire TOEIC : anglais | français ---------- */
  const vocabRaw = `invoice|facture
deadline|date limite
refund|remboursement
shipment|expédition
warranty|garantie
to attend|assister à
to schedule|planifier
supervisor|responsable
staff|personnel
to postpone|reporter
to cancel|annuler
reservation|réservation
itinerary|itinéraire
boarding|embarquement
baggage claim|retrait des bagages
layover|escale
fare|tarif
to confirm|confirmer
brochure|brochure
to renew|renouveler
payroll|paie
to hire|embaucher
résumé|CV
applicant|candidat
benefit|avantage
agenda|ordre du jour
to enclose|joindre
to deliver|livrer
complimentary|gratuit, offert
vacancy|poste vacant, chambre libre
premises|locaux
to reimburse|rembourser
overdue|en retard (paiement)
to run out of|ne plus avoir de
supplier|fournisseur
to handle|gérer, traiter
request|demande
lounge|salon
tarmac|piste, aire de trafic
fuel|carburant
clearance|autorisation
catering|restauration
turbulence|turbulences
tail number|immatriculation de l'avion`;
  const vocab = vocabRaw.split('\n').map(l => { const [en, fr] = l.split('|'); return { en, fr }; });

  /* ---------- TOEIC partie 5 (phrases à compléter) ---------- */
  const toeic = [
    M('The new policy will take effect ___ January 1.', ['on', 'at', 'in', 'since'], 'Date précise → on.', 'toeic'),
    M('Ms. Tanaka is ___ for coordinating all client visits.', ['responsible', 'response', 'responsibly', 'respond'], 'Après be : adjectif → responsible.', 'toeic'),
    M('Please submit your expense report ___ Friday.', ['by', 'during', 'since', 'while'], '« by » = au plus tard.', 'toeic'),
    M('The conference was ___ attended, with over 500 participants.', ['well', 'good', 'best', 'goodly'], 'well attended = bien suivi.', 'toeic'),
    M('___ the heavy rain, the flight departed on time.', ['Despite', 'Although', 'Because', 'However'], '« Despite » + groupe nominal.', 'toeic'),
    M('All visitors must ___ at the front desk.', ['register', 'registration', 'registered', 'registering'], 'must + verbe de base.', 'toeic'),
    M('The shipment ___ yesterday, so it should arrive soon.', ['was sent', 'sent', 'has been sending', 'is sent'], 'yesterday + passif → was sent.', 'toeic'),
    M('We are pleased to ___ you that your application was successful.', ['inform', 'informs', 'informing', 'information'], 'to + verbe de base.', 'toeic'),
    M('Mr. Costa has worked here ___ ten years.', ['for', 'since', 'during', 'from'], 'for + durée.', 'toeic'),
    M('The budget is ___ than we expected.', ['lower', 'low', 'lowest', 'more low'], 'Comparatif de low : lower.', 'toeic'),
    M('Our flights are ___ frequent than those of our competitors.', ['more', 'most', 'as', 'very'], 'Comparatif avec than → more frequent.', 'toeic'),
    M('If you ___ any questions, please contact the front desk.', ['have', 'will have', 'had had', 'are having'], 'if + présent.', 'toeic'),
    M('The meeting has been ___ until next week.', ['postponed', 'postponing', 'postpone', 'postpones'], 'has been + participe passé.', 'toeic'),
    M('She is the person ___ organised the event.', ['who', 'which', 'whose', 'whom'], 'Personne sujet → who.', 'toeic'),
    M('Customers can pay ___ in cash or by card.', ['either', 'both', 'neither', 'each'], 'either … or.', 'toeic'),
    M('The manager asked us ___ the document carefully.', ['to read', 'reading', 'read', 'for read'], 'ask someone to + verbe.', 'toeic'),
    M('___ you need a receipt, please ask the cashier.', ['Should', 'Would', 'Must', 'Do'], 'Should you need = If you need (forme formelle).', 'toeic'),
    M("The company's profits have increased ___ over the past year.", ['significantly', 'significant', 'significance', 'signify'], 'Adverbe pour modifier un verbe.', 'toeic'),
    M('Because of the strike, ___ trains were cancelled.', ['several', 'much', 'a little', 'every'], 'trains (pluriel dénombrable) → several.', 'toeic'),
    M('The hotel offers free Wi-Fi ___ all guests.', ['to', 'at', 'on', 'by'], 'offer something to someone.', 'toeic'),
    M('Please keep your receipt ___ proof of purchase.', ['as', 'like', 'so', 'than'], 'as = en tant que.', 'toeic'),
    M('We regret ___ you that the flight is full.', ['to inform', 'informing', 'to informing', 'inform'], 'regret to + verbe (annoncer une mauvaise nouvelle).', 'toeic'),
    M('He apologised ___ the delay.', ['for', 'of', 'to', 'with'], 'apologise for.', 'toeic'),
    M('The new terminal will be ___ next spring.', ['completed', 'completing', 'complete', 'completes'], 'will be + participe passé.', 'toeic')
  ];

  window.DATA = { test, chapters, verbs, spell, vocab, toeic };
})();
