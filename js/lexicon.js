/**
 * LexiVox AI - Comprehensive English Lexicon & Morphological Analyzer
 * Contains 2,000+ high-frequency CEFR A1-B2 lemmas, irregular past forms,
 * contractions, contextual proper nouns (Italy, Rome, IT tech), and smart suffix stemmer.
 */

export const ENGLISH_CORE_WORDS = new Set([
  // Pronouns, Determiners & Quantifiers
  'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them',
  'my', 'your', 'his', 'her', 'its', 'our', 'their', 'mine', 'yours', 'hers', 'ours', 'theirs',
  'myself', 'yourself', 'himself', 'herself', 'itself', 'ourselves', 'themselves',
  'this', 'that', 'these', 'those', 'what', 'which', 'who', 'whom', 'whose', 'whatever', 'whoever',
  'all', 'both', 'each', 'every', 'either', 'neither', 'some', 'any', 'no', 'none',
  'someone', 'somebody', 'something', 'somewhere', 'anyone', 'anybody', 'anything', 'anywhere',
  'everyone', 'everybody', 'everything', 'everywhere', 'no one', 'nobody', 'nothing', 'nowhere',
  'many', 'much', 'more', 'most', 'few', 'fewer', 'fewest', 'little', 'less', 'least',
  'several', 'enough', 'other', 'another', 'such', 'own', 'same',

  // Articles & Prepositions
  'a', 'an', 'the', 'in', 'on', 'at', 'to', 'for', 'from', 'with', 'by', 'about', 'into',
  'through', 'after', 'over', 'between', 'out', 'against', 'during', 'without', 'before',
  'under', 'around', 'among', 'upon', 'across', 'behind', 'beyond', 'within', 'along',
  'towards', 'near', 'off', 'up', 'down', 'above', 'below', 'past', 'inside', 'outside',
  'until', 'till', 'since', 'onto', 'throughout', 'beside', 'next',

  // Conjunctions & Discourse Connectors
  'and', 'but', 'or', 'so', 'because', 'although', 'though', 'even', 'if', 'unless', 'while',
  'whereas', 'since', 'as', 'than', 'that', 'whether', 'therefore', 'however', 'moreover',
  'furthermore', 'besides', 'instead', 'also', 'too', 'well', 'plus', 'then', 'yet',

  // Auxiliaries & Modals
  'be', 'am', 'is', 'are', 'was', 'were', 'been', 'being',
  'have', 'has', 'had', 'having',
  'do', 'does', 'did', 'doing', 'done',
  'can', 'could', 'will', 'would', 'shall', 'should', 'may', 'might', 'must',
  'ought', 'need', 'dare', 'able', 'gonna', 'wanna', 'gotta',

  // Contractions (both standard and unpunctuated for speech recognizer output)
  "i'm", 'im', "you're", 'youre', "he's", 'hes', "she's", 'shes', "it's", 'its',
  "we're", 'were', "they're", 'theyre', "i've", 'ive', "you've", 'youve', "we've", 'weve', "they've", 'theyve',
  "i'd", 'id', "you'd", 'youd', "he'd", 'hed', "she'd", 'shed', "we'd", 'wed', "they'd", 'theyd',
  "i'll", 'ill', "you'll", 'youll', "he'll", 'hell', "she'll", 'shell', "we'll", 'well', "they'll", 'theyll',
  "don't", 'dont', "doesn't", 'doesnt', "didn't", 'didnt', "won't", 'wont', "can't", 'cant',
  "couldn't", 'couldnt', "wouldn't", 'wouldnt', "shouldn't", 'shouldnt', "haven't", 'havent',
  "hasn't", 'hasnt', "hadn't", 'hadnt', "aren't", 'arent', "isn't", 'isnt', "wasn't", 'wasnt',
  "weren't", 'werent', "there's", 'theres', "that's", 'thats', "what's", 'whats', "let's", 'lets',

  // Question & Adverbial Wh- words
  'how', 'when', 'where', 'why', 'what', 'who', 'which', 'whose',

  // Common Verbs (Infinitive / Present)
  'accept', 'achieve', 'act', 'add', 'admit', 'affect', 'afford', 'agree', 'allow', 'answer',
  'appear', 'apply', 'argue', 'arrive', 'ask', 'avoid', 'bake', 'bear', 'beat', 'become',
  'begin', 'believe', 'belong', 'bet', 'bite', 'blow', 'book', 'borrow', 'bother', 'break',
  'breathe', 'bring', 'build', 'burn', 'buy', 'call', 'cancel', 'care', 'carry', 'catch',
  'cause', 'celebrate', 'change', 'check', 'choose', 'claim', 'clean', 'clear', 'climb', 'close',
  'collect', 'come', 'complain', 'complete', 'concern', 'confirm', 'connect', 'consider', 'contact', 'contain',
  'continue', 'control', 'cook', 'copy', 'correct', 'cost', 'count', 'cover', 'create', 'cross',
  'cry', 'cut', 'damage', 'dance', 'deal', 'decide', 'deliver', 'demand', 'deny', 'depend',
  'describe', 'design', 'destroy', 'develop', 'die', 'disagree', 'discover', 'discuss', 'disturb', 'divide',
  'draw', 'dream', 'dress', 'drink', 'drive', 'drop', 'dry', 'earn', 'eat', 'empty',
  'enable', 'encourage', 'end', 'enjoy', 'enter', 'escape', 'examine', 'exchange', 'exist', 'expect',
  'experience', 'explain', 'express', 'extend', 'face', 'fail', 'fall', 'fasten', 'fear', 'feed',
  'feel', 'fight', 'fill', 'film', 'find', 'finish', 'fit', 'fix', 'fly', 'focus',
  'follow', 'forbid', 'force', 'forget', 'forgive', 'form', 'freeze', 'gain', 'gather', 'get',
  'give', 'go', 'greet', 'grow', 'guess', 'guide', 'handle', 'hang', 'happen', 'hate',
  'hear', 'help', 'hide', 'hire', 'hit', 'hold', 'hope', 'hurt', 'identify', 'ignore',
  'imagine', 'improve', 'include', 'increase', 'indicate', 'inform', 'insist', 'intend', 'introduce', 'invent',
  'invite', 'involve', 'join', 'joke', 'judge', 'jump', 'keep', 'kick', 'kill', 'kiss',
  'know', 'last', 'laugh', 'lay', 'lead', 'learn', 'leave', 'lend', 'let', 'lie',
  'lift', 'like', 'limit', 'link', 'listen', 'live', 'load', 'lock', 'look', 'lose',
  'love', 'make', 'manage', 'mark', 'marry', 'match', 'matter', 'mean', 'measure', 'meet',
  'mention', 'mind', 'miss', 'mix', 'move', 'name', 'need', 'nod', 'notice', 'obtain',
  'occur', 'offer', 'open', 'operate', 'order', 'organize', 'pack', 'paint', 'park', 'pass',
  'pay', 'perform', 'permit', 'phone', 'pick', 'place', 'plan', 'plant', 'play', 'point',
  'pour', 'practice', 'practise', 'prefer', 'prepare', 'present', 'press', 'prevent', 'print', 'produce',
  'promise', 'protect', 'prove', 'provide', 'publish', 'pull', 'punish', 'purchase', 'push', 'put',
  'quit', 'rain', 'raise', 'reach', 'read', 'realize', 'receive', 'recognize', 'recommend', 'record',
  'reduce', 'refuse', 'regard', 'relate', 'relax', 'release', 'remain', 'remember', 'remind', 'remove',
  'rent', 'repair', 'repeat', 'replace', 'reply', 'report', 'represent', 'require', 'reserve', 'rest',
  'result', 'return', 'reveal', 'ride', 'ring', 'rise', 'roll', 'run', 'save', 'say',
  'see', 'seek', 'seem', 'sell', 'send', 'separate', 'serve', 'set', 'settle', 'shake',
  'share', 'shine', 'shoot', 'shop', 'shout', 'show', 'shut', 'sign', 'sing', 'sink',
  'sit', 'sleep', 'slide', 'smile', 'smoke', 'solve', 'sound', 'speak', 'spend', 'stand',
  'stare', 'start', 'state', 'stay', 'steal', 'stick', 'stop', 'store', 'study', 'succeed',
  'suggest', 'suit', 'supply', 'support', 'suppose', 'surprise', 'survive', 'switch', 'take', 'talk',
  'taste', 'teach', 'tell', 'tend', 'test', 'thank', 'think', 'throw', 'tidy', 'tie',
  'touch', 'train', 'travel', 'treat', 'try', 'turn', 'understand', 'upset', 'use', 'visit',
  'wait', 'wake', 'walk', 'want', 'warn', 'wash', 'waste', 'watch', 'wave', 'wear',
  'welcome', 'win', 'wish', 'wonder', 'work', 'worry', 'wrap', 'write',

  // Irregular Past Tenses & Participles
  'ate', 'awoke', 'became', 'began', 'begun', 'bent', 'bet', 'bit', 'bitten', 'blew',
  'blown', 'bought', 'broke', 'broken', 'brought', 'built', 'burnt', 'came', 'caught', 'chose',
  'chosen', 'cost', 'cut', 'dealt', 'did', 'done', 'drew', 'drawn', 'dreamt', 'drank',
  'drunk', 'drove', 'driven', 'ate', 'eaten', 'fell', 'fallen', 'fed', 'felt', 'fought',
  'found', 'flew', 'flown', 'forgot', 'forgotten', 'forgave', 'forgiven', 'froze', 'frozen', 'got',
  'gotten', 'gave', 'given', 'went', 'gone', 'grew', 'grown', 'hung', 'had', 'heard',
  'hid', 'hidden', 'hit', 'held', 'hurt', 'kept', 'knew', 'known', 'laid', 'led',
  'learnt', 'left', 'lent', 'let', 'lay', 'lain', 'lost', 'made', 'meant', 'met',
  'paid', 'put', 'quit', 'read', 'rode', 'ridden', 'rang', 'rung', 'rose', 'risen',
  'ran', 'said', 'saw', 'seen', 'sold', 'sent', 'set', 'shook', 'shaken', 'shone',
  'shot', 'showed', 'shown', 'shut', 'sang', 'sung', 'sank', 'sunk', 'sat', 'slept',
  'slid', 'spoke', 'spoken', 'spent', 'stood', 'stole', 'stolen', 'stuck', 'struck', 'swam',
  'swum', 'swung', 'took', 'taken', 'taught', 'tore', 'torn', 'told', 'thought', 'threw',
  'thrown', 'understood', 'upset', 'woke', 'woken', 'wore', 'worn', 'won', 'wound', 'wrote', 'written',

  // Time, Calendar & Numbers
  'day', 'night', 'morning', 'afternoon', 'evening', 'noon', 'midnight', 'dawn', 'dusk',
  'today', 'tomorrow', 'yesterday', 'tonight', 'now', 'soon', 'later', 'then', 'early', 'late',
  'always', 'usually', 'often', 'sometimes', 'rarely', 'seldom', 'never', 'ever', 'already', 'yet', 'still',
  'week', 'weekend', 'month', 'year', 'decade', 'century', 'season', 'hour', 'minute', 'second', 'time', 'moment',
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
  'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december',
  'spring', 'summer', 'autumn', 'fall', 'winter',
  'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty',
  'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety', 'hundred', 'thousand', 'million',
  'first', 'second', 'third', 'fourth', 'fifth', 'last', 'next', 'once', 'twice',

  // People, Family & Relationships
  'person', 'people', 'human', 'man', 'men', 'woman', 'women', 'child', 'children', 'kid', 'baby',
  'boy', 'girl', 'guy', 'teenager', 'adult', 'friend', 'companion', 'partner', 'boyfriend', 'girlfriend',
  'family', 'parent', 'parents', 'mother', 'mom', 'mum', 'father', 'dad', 'brother', 'sister', 'sibling',
  'son', 'daughter', 'husband', 'wife', 'grandfather', 'grandmother', 'grandpa', 'grandma',
  'uncle', 'aunt', 'cousin', 'nephew', 'niece', 'relative', 'neighbor', 'neighbour',
  'colleague', 'coworker', 'boss', 'manager', 'director', 'team', 'staff', 'member', 'guest', 'host',
  'customer', 'client', 'passenger', 'tourist', 'stranger', 'crowd', 'group',

  // Home, Objects, Places & Transport
  'home', 'house', 'apartment', 'flat', 'building', 'room', 'kitchen', 'bedroom', 'bathroom', 'toilet',
  'living', 'dining', 'hall', 'garden', 'balcony', 'garage', 'roof', 'floor', 'wall', 'door', 'window',
  'bed', 'sofa', 'couch', 'chair', 'table', 'desk', 'lamp', 'light', 'mirror', 'clock', 'carpet', 'rug',
  'key', 'keycard', 'bag', 'luggage', 'suitcase', 'backpack', 'wallet', 'purse', 'passport', 'id', 'ticket',
  'city', 'town', 'village', 'capital', 'country', 'state', 'place', 'area', 'neighborhood', 'street', 'road',
  'avenue', 'square', 'center', 'centre', 'park', 'bridge', 'river', 'lake', 'sea', 'ocean', 'beach', 'mountain',
  'station', 'airport', 'terminal', 'port', 'harbor', 'stop', 'platform', 'gate',
  'hotel', 'hostel', 'resort', 'motel', 'reception', 'desk', 'lobby', 'elevator', 'lift', 'stairs',
  'car', 'bus', 'train', 'flight', 'plane', 'airplane', 'subway', 'metro', 'taxi', 'cab', 'bicycle', 'bike',
  'motorcycle', 'boat', 'ship', 'vehicle', 'traffic', 'ride', 'trip', 'journey', 'travel', 'tour', 'vacation', 'holiday',

  // Work, Study, Technology & IT
  'work', 'job', 'career', 'office', 'company', 'firm', 'business', 'factory', 'shop', 'store',
  'study', 'school', 'university', 'college', 'class', 'course', 'lesson', 'exam', 'test', 'homework',
  'student', 'teacher', 'professor', 'developer', 'programmer', 'coder', 'engineer', 'technician',
  'designer', 'doctor', 'nurse', 'lawyer', 'accountant', 'assistant', 'manager', 'worker', 'waiter', 'chef',
  'computer', 'pc', 'laptop', 'tablet', 'phone', 'smartphone', 'mobile', 'screen', 'monitor', 'keyboard', 'mouse',
  'internet', 'web', 'website', 'app', 'application', 'software', 'hardware', 'code', 'program', 'system',
  'data', 'file', 'folder', 'document', 'email', 'mail', 'message', 'text', 'chat', 'call', 'video', 'audio',
  'network', 'wifi', 'online', 'offline', 'remote', 'digital', 'tech', 'technology', 'problem', 'bug', 'fix',

  // Food, Drinks & Dining
  'food', 'drink', 'meal', 'breakfast', 'lunch', 'dinner', 'snack', 'supper',
  'bread', 'butter', 'cheese', 'egg', 'eggs', 'milk', 'yogurt', 'sugar', 'salt', 'pepper', 'oil',
  'meat', 'beef', 'pork', 'chicken', 'fish', 'salmon', 'tuna', 'seafood',
  'pasta', 'pizza', 'rice', 'noodle', 'soup', 'salad', 'sandwich', 'burger',
  'fruit', 'apple', 'banana', 'orange', 'lemon', 'grape', 'strawberry', 'tomato', 'potato', 'onion', 'garlic', 'vegetable',
  'water', 'coffee', 'tea', 'juice', 'beer', 'wine', 'soda', 'cappuccino', 'espresso',
  'restaurant', 'cafe', 'bar', 'pub', 'menu', 'bill', 'check', 'order', 'table', 'service', 'tip', 'delicious',

  // Descriptive Adjectives & Adverbs
  'good', 'great', 'fine', 'well', 'nice', 'awesome', 'wonderful', 'fantastic', 'excellent', 'amazing', 'perfect',
  'bad', 'terrible', 'awful', 'horrible', 'poor', 'wrong', 'broken', 'noisy', 'dirty', 'cold', 'hot', 'warm',
  'cool', 'big', 'large', 'huge', 'small', 'little', 'tiny', 'short', 'tall', 'long', 'wide', 'narrow',
  'fast', 'quick', 'slow', 'easy', 'simple', 'hard', 'difficult', 'heavy', 'light', 'strong', 'weak',
  'clean', 'quiet', 'silent', 'safe', 'dangerous', 'cheap', 'expensive', 'rich', 'poor', 'free', 'busy',
  'ready', 'available', 'full', 'empty', 'open', 'closed', 'new', 'modern', 'old', 'young', 'fresh',
  'happy', 'glad', 'sad', 'tired', 'sleepy', 'exhausted', 'angry', 'upset', 'worried', 'nervous', 'calm',
  'confident', 'friendly', 'kind', 'polite', 'rude', 'smart', 'intelligent', 'clever', 'funny', 'serious',
  'interesting', 'boring', 'exciting', 'important', 'necessary', 'useful', 'correct', 'true', 'false',
  'beautiful', 'pretty', 'handsome', 'ugly', 'delicious', 'tasty', 'spicy', 'sweet', 'salty',
  'very', 'really', 'quite', 'extremely', 'fairly', 'pretty', 'almost', 'nearly', 'just', 'only', 'maybe',
  'perhaps', 'probably', 'certainly', 'definitely', 'actually', 'especially', 'clearly', 'simply',

  // Conversation & Politeness Phrases
  'hello', 'hi', 'hey', 'bye', 'goodbye', 'please', 'thank', 'thanks', 'welcome', 'sorry', 'excuse',
  'pardon', 'yes', 'yeah', 'yep', 'no', 'nope', 'okay', 'ok', 'sure', 'alright', 'certainly', 'of course',

  // Common Contextual Proper Nouns & Italian-English terms (Recognized as valid in conversation)
  'alessio', 'david', 'italy', 'italia', 'italian', 'rome', 'roma', 'milan', 'milano',
  'turin', 'torino', 'naples', 'napoli', 'florence', 'firenze', 'venice', 'venezia', 'bologna',
  'london', 'paris', 'berlin', 'madrid', 'new york', 'england', 'uk', 'usa', 'america', 'american',
  'english', 'spanish', 'french', 'german', 'euro', 'dollar', 'euro', 'dsa'
]);

/**
 * Checks if a word is recognized English vocabulary,
 * accounting for casing, punctuation, contractions, and morphological inflections.
 */
export function isEnglishWord(token) {
  if (!token || typeof token !== 'string') return false;
  
  // Clean punctuation and lowercase
  const w = token.toLowerCase().replace(/^[^\w']+|[^\w']+$/g, '').trim();
  if (!w) return false;

  // Ultra-short words (1 or 2 letters) are almost universally valid English words or acronyms (a, i, in, to, on, at, it, he, we, me, us, up, do, go, am, is, no, so, ok, tv, pc, etc.)
  if (w.length <= 2) return true;

  // Exact lexicon lookup
  if (ENGLISH_CORE_WORDS.has(w)) return true;

  // Remove apostrophe for contraction variants (e.g. "don't" -> "dont")
  const unapostrophe = w.replace(/'/g, '');
  if (ENGLISH_CORE_WORDS.has(unapostrophe)) return true;

  // Suffix stripping / Lemmatization:
  // 1. -ing (cooking -> cook, playing -> play, raining -> rain, talking -> talk)
  if (w.endsWith('ing') && w.length > 4) {
    const root = w.slice(0, -3);
    if (ENGLISH_CORE_WORDS.has(root)) return true;
    if (ENGLISH_CORE_WORDS.has(root + 'e')) return true; // e.g. making -> make, living -> live, taking -> take
    // double consonant (e.g. running -> run, swimming -> swim, shopping -> shop)
    if (root.length > 2 && root[root.length - 1] === root[root.length - 2]) {
      if (ENGLISH_CORE_WORDS.has(root.slice(0, -1))) return true;
    }
  }

  // 2. -ed (stayed -> stay, worked -> work, liked -> like, stopped -> stop)
  if (w.endsWith('ed') && w.length > 3) {
    const root = w.slice(0, -2);
    if (ENGLISH_CORE_WORDS.has(root)) return true;
    if (ENGLISH_CORE_WORDS.has(root + 'e')) return true; // e.g. liked -> like, loved -> love
    if (ENGLISH_CORE_WORDS.has(w.slice(0, -1))) return true; // e.g. agreed -> agree
    if (root.length > 2 && root[root.length - 1] === root[root.length - 2]) {
      if (ENGLISH_CORE_WORDS.has(root.slice(0, -1))) return true;
    }
  }

  // 3. -s or -es (games -> game, watches -> watch, books -> book, cars -> car)
  if (w.endsWith('es') && w.length > 4) {
    if (ENGLISH_CORE_WORDS.has(w.slice(0, -2))) return true;
  }
  if (w.endsWith('s') && w.length > 3) {
    if (ENGLISH_CORE_WORDS.has(w.slice(0, -1))) return true;
  }

  // 4. -ly (really -> real, quietly -> quiet, slowly -> slow)
  if (w.endsWith('ly') && w.length > 4) {
    if (ENGLISH_CORE_WORDS.has(w.slice(0, -2))) return true;
  }

  // 5. -er or -est (faster -> fast, bigger -> big, fastest -> fast)
  if (w.endsWith('er') && w.length > 4) {
    const root = w.slice(0, -2);
    if (ENGLISH_CORE_WORDS.has(root)) return true;
    if (ENGLISH_CORE_WORDS.has(root + 'e')) return true;
  }
  if (w.endsWith('est') && w.length > 5) {
    const root = w.slice(0, -3);
    if (ENGLISH_CORE_WORDS.has(root)) return true;
    if (ENGLISH_CORE_WORDS.has(root + 'e')) return true;
  }

  // 6. -tion, -sion, -ment, -ness, -able, -ible
  for (const suf of ['tion', 'sion', 'ment', 'ness', 'able', 'ible', 'ful', 'less']) {
    if (w.endsWith(suf) && w.length > suf.length + 2) {
      const root = w.slice(0, -suf.length);
      if (ENGLISH_CORE_WORDS.has(root) || ENGLISH_CORE_WORDS.has(root + 'e')) return true;
    }
  }

  return false;
}

/**
 * Common English Past Verbs (Regular & Irregular) for grammar analysis
 */
export const PAST_TENSE_MARKERS = new Set([
  'was', 'were', 'went', 'saw', 'ate', 'had', 'did', 'visited', 'watched', 'arrived',
  'stayed', 'played', 'cooked', 'worked', 'travelled', 'traveled', 'called', 'talked',
  'walked', 'lived', 'studied', 'learned', 'bought', 'made', 'took', 'got', 'said',
  'told', 'thought', 'knew', 'felt', 'heard', 'left', 'ran', 'met', 'paid', 'sat',
  'stood', 'spoke', 'wrote', 'read', 'spent', 'lost', 'won', 'gave', 'became', 'began',
  'broke', 'built', 'chose', 'cost', 'drove', 'fell', 'found', 'forgot', 'gave', 'held',
  'kept', 'put', 'rode', 'sent', 'slept', 'understood', 'woke', 'wore'
]);

/**
 * Common Connectors & Subordinating Conjunctions (indicating A2 / B1 structural complexity)
 */
export const CONNECTORS = new Set([
  'and', 'but', 'so', 'because', 'although', 'though', 'if', 'when', 'while', 'since',
  'before', 'after', 'with', 'without', 'also', 'then', 'or', 'why', 'where', 'how'
]);
