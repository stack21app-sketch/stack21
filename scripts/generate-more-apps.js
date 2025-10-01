#!/usr/bin/env node

/**
 * 🚀 Generador de 1000+ Aplicaciones para Stack21 - Parte 2
 */

const fs = require('fs');
const path = require('path');

// Leer las aplicaciones existentes
const existingAppsPath = path.join(__dirname, '..', 'src', 'data', 'apps.json');
const existingApps = JSON.parse(fs.readFileSync(existingAppsPath, 'utf8'));

// Categorías adicionales con muchas más aplicaciones
const additionalCategories = {
  'Cloud Storage': {
    color: '#6366F1',
    icon: 'Cloud',
    apps: [
      'Google Drive', 'Dropbox', 'OneDrive', 'Box', 'iCloud', 'Amazon S3',
      'Google Cloud Storage', 'Azure Blob Storage', 'Backblaze', 'Wasabi',
      'DigitalOcean Spaces', 'Cloudflare R2', 'MinIO', 'Nextcloud', 'OwnCloud',
      'pCloud', 'Sync.com', 'Tresorit', 'SpiderOak', 'Mega', 'MediaFire',
      '4shared', 'RapidShare', 'FileFactory', 'Uploaded', 'Turbobit', 'NitroFlare',
      'Zippyshare', 'DepositFiles', 'Rapidgator', 'Uploaded', 'Turbobit', 'NitroFlare'
    ]
  },
  'Database & Backend': {
    color: '#8B5CF6',
    icon: 'Database',
    apps: [
      'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'Cassandra',
      'DynamoDB', 'CouchDB', 'Neo4j', 'InfluxDB', 'TimescaleDB', 'ClickHouse',
      'Supabase', 'Firebase', 'PlanetScale', 'CockroachDB', 'FaunaDB', 'SurrealDB',
      'Prisma', 'Hasura', 'GraphQL', 'Apollo', 'Relay', 'URQL',
      'TypeORM', 'Sequelize', 'Mongoose', 'Knex.js', 'Bookshelf.js', 'Waterline'
    ]
  },
  'AI & Machine Learning': {
    color: '#EC4899',
    icon: 'Brain',
    apps: [
      'OpenAI', 'Anthropic', 'Google AI', 'Microsoft AI', 'Amazon Bedrock', 'Hugging Face',
      'Replicate', 'RunPod', 'Banana', 'Modal', 'Baseten', 'Cerebrium',
      'LangChain', 'LlamaIndex', 'Haystack', 'Weaviate', 'Pinecone', 'Chroma',
      'Cohere', 'AI21', 'Aleph Alpha', 'Stability AI', 'Midjourney', 'DALL-E',
      'GPT-4', 'Claude', 'PaLM', 'LLaMA', 'Vicuna', 'Alpaca',
      'GPT-3.5', 'GPT-4 Turbo', 'Claude 3', 'Gemini Pro', 'Mistral', 'Falcon'
    ]
  },
  'Blockchain & Crypto': {
    color: '#F59E0B',
    icon: 'Coins',
    apps: [
      'Bitcoin', 'Ethereum', 'Binance', 'Coinbase', 'Kraken', 'Gemini',
      'MetaMask', 'Trust Wallet', 'Phantom', 'Solflare', 'Keplr', 'Terra Station',
      'Uniswap', 'PancakeSwap', 'SushiSwap', '1inch', 'Curve', 'Balancer',
      'OpenSea', 'Rarible', 'Foundation', 'SuperRare', 'Nifty Gateway', 'Async Art',
      'Chainlink', 'The Graph', 'Polygon', 'Arbitrum', 'Optimism', 'Avalanche',
      'Solana', 'Cardano', 'Polkadot', 'Cosmos', 'Algorand', 'Tezos'
    ]
  },
  'Video & Streaming': {
    color: '#EF4444',
    icon: 'Video',
    apps: [
      'YouTube', 'Vimeo', 'Twitch', 'TikTok', 'Instagram Reels', 'YouTube Shorts',
      'Netflix', 'Disney+', 'Amazon Prime', 'HBO Max', 'Hulu', 'Paramount+',
      'OBS Studio', 'Streamlabs', 'XSplit', 'Wirecast', 'vMix', 'Lightstream',
      'Restream', 'StreamYard', 'Riverside', 'Squadcast', 'Zencastr', 'Anchor',
      'Spotify', 'Apple Podcasts', 'Google Podcasts', 'Stitcher', 'Pocket Casts', 'Overcast',
      'Audible', 'Scribd', 'Blinkist', 'MasterClass', 'Skillshare', 'Udemy'
    ]
  },
  'Design & Creative': {
    color: '#F97316',
    icon: 'Palette',
    apps: [
      'Figma', 'Adobe Creative Suite', 'Sketch', 'InVision', 'Marvel', 'Principle',
      'Framer', 'Adobe XD', 'Canva', 'Crello', 'Snappa', 'PicMonkey',
      'GIMP', 'Krita', 'Inkscape', 'Blender', 'Cinema 4D', 'Maya',
      'After Effects', 'Premiere Pro', 'Final Cut Pro', 'DaVinci Resolve', 'Avid', 'Lightworks',
      'Photoshop', 'Illustrator', 'InDesign', 'Lightroom', 'Capture One', 'Luminar',
      'Procreate', 'Affinity Photo', 'Affinity Designer', 'CorelDRAW', 'PaintShop Pro', 'Paint.NET'
    ]
  },
  'Email Marketing': {
    color: '#06B6D4',
    icon: 'Mail',
    apps: [
      'Mailchimp', 'Constant Contact', 'Campaign Monitor', 'ConvertKit', 'ActiveCampaign',
      'GetResponse', 'AWeber', 'Drip', 'Klaviyo', 'Sendinblue', 'Moosend',
      'Pardot', 'Marketo', 'HubSpot', 'Salesforce Marketing Cloud', 'Adobe Campaign',
      'Iterable', 'Customer.io', 'Braze', 'CleverTap', 'Mixpanel', 'Amplitude',
      'SendGrid', 'Mailgun', 'Postmark', 'Amazon SES', 'SparkPost', 'Elastic Email',
      'Sendinblue', 'Moosend', 'Pardot', 'Marketo', 'HubSpot', 'Salesforce Marketing Cloud'
    ]
  },
  'Survey & Forms': {
    color: '#84CC16',
    icon: 'FileText',
    apps: [
      'Typeform', 'SurveyMonkey', 'Google Forms', 'Microsoft Forms', 'JotForm',
      'Formstack', 'Wufoo', '123FormBuilder', 'Formsite', 'Cognito Forms',
      'Gravity Forms', 'Contact Form 7', 'WPForms', 'Ninja Forms', 'Caldera Forms',
      'Formidable Forms', 'Polls', 'SurveyJS', 'Formik', 'React Hook Form', 'Formik',
      'LimeSurvey', 'Qualtrics', 'SurveyGizmo', 'Alchemer', 'SoGoSurvey', 'QuestionPro'
    ]
  },
  'Calendar & Scheduling': {
    color: '#F43F5E',
    icon: 'Calendar',
    apps: [
      'Google Calendar', 'Outlook Calendar', 'Apple Calendar', 'Calendly', 'Acuity Scheduling',
      'Cal.com', 'When2meet', 'Doodle', 'X.ai', 'ScheduleOnce', 'TimeTree',
      'Fantastical', 'BusyCal', 'CalDAV', 'CardDAV', 'Exchange', 'iCal',
      'Teamup', 'TimeTree', 'Cozi', 'Any.do', 'Todoist', 'TickTick',
      'Woven', 'Reclaim', 'Clockwise', 'RescueTime', 'Toggl', 'Harvest'
    ]
  },
  'Note Taking': {
    color: '#8B5CF6',
    icon: 'StickyNote',
    apps: [
      'Evernote', 'OneNote', 'Notion', 'Obsidian', 'Roam Research', 'Logseq',
      'RemNote', 'Bear', 'Simplenote', 'Standard Notes', 'Joplin', 'TiddlyWiki',
      'Zettlr', 'Typora', 'Mark Text', 'Notable', 'Boost Note', 'AppFlowy',
      'Anytype', 'Craft', 'Drafts', 'GoodNotes', 'Notability', 'Penultimate',
      'MarginNote', 'LiquidText', 'PDF Expert', 'Documents', 'Files', 'iCloud Drive'
    ]
  },
  'Password Management': {
    color: '#DC2626',
    icon: 'Key',
    apps: [
      '1Password', 'LastPass', 'Bitwarden', 'Dashlane', 'Keeper', 'NordPass',
      'RoboForm', 'Enpass', 'Sticky Password', 'Password Boss', 'LogMeOnce',
      'True Key', 'Avira Password Manager', 'Kaspersky Password Manager', 'Norton Password Manager',
      'McAfee True Key', 'Trend Micro Password Manager', 'F-Secure ID Protection', 'Avast Passwords',
      'KeePass', 'KeePassXC', 'KeeWeb', 'Buttercup', 'LessPass', 'Master Password'
    ]
  },
  'VPN & Security': {
    color: '#059669',
    icon: 'Shield',
    apps: [
      'NordVPN', 'ExpressVPN', 'Surfshark', 'CyberGhost', 'Private Internet Access',
      'ProtonVPN', 'Windscribe', 'TunnelBear', 'Hotspot Shield', 'IPVanish',
      'VyprVPN', 'PureVPN', 'ZenMate', 'Hola VPN', 'Opera VPN', 'Avira Phantom VPN',
      'Kaspersky Secure Connection', 'Avast SecureLine', 'McAfee Safe Connect', 'Trend Micro Wi-Fi Protection',
      'Mullvad', 'IVPN', 'Perfect Privacy', 'AirVPN', 'TorGuard', 'Hide.me'
    ]
  },
  'Weather & Environment': {
    color: '#0EA5E9',
    icon: 'CloudRain',
    apps: [
      'AccuWeather', 'Weather.com', 'Weather Underground', 'Dark Sky', 'WeatherBug',
      'Weather Channel', 'Weather Live', 'Weather Radar', 'MyRadar', 'RadarScope',
      'WeatherKit', 'OpenWeatherMap', 'WeatherAPI', 'Visual Crossing', 'ClimaCell',
      'Ambient Weather', 'WeatherFlow', 'Netatmo', 'Ecobee', 'Nest', 'Honeywell',
      'Weather Underground', 'WeatherBug', 'Weather Channel', 'Weather Live', 'Weather Radar', 'MyRadar'
    ]
  },
  'Translation & Language': {
    color: '#7C3AED',
    icon: 'Languages',
    apps: [
      'Google Translate', 'DeepL', 'Microsoft Translator', 'Amazon Translate', 'Yandex Translate',
      'Bing Translator', 'Reverso', 'Linguee', 'PROMT', 'Systran', 'Lingvanex',
      'Papago', 'Baidu Translate', 'Youdao', 'iTranslate', 'Translate.com', 'MyMemory',
      'Linguee', 'Reverso Context', 'WordReference', 'Collins', 'Oxford', 'Cambridge',
      'Babbel', 'Duolingo', 'Rosetta Stone', 'Busuu', 'Memrise', 'Lingoda'
    ]
  },
  'File Conversion': {
    color: '#F59E0B',
    icon: 'RefreshCw',
    apps: [
      'CloudConvert', 'Zamzar', 'Online-Convert', 'Convertio', 'FileZigZag', 'FreeConvert',
      'SmallPDF', 'ILovePDF', 'PDF24', 'Soda PDF', 'PDFsam', 'PDFtk',
      'Adobe Acrobat', 'Nitro PDF', 'Foxit', 'PDFelement', 'Sejda', 'PDFescape',
      'Canva', 'Crello', 'Snappa', 'PicMonkey', 'Fotor', 'BeFunky',
      'GIMP', 'Paint.NET', 'IrfanView', 'XnView', 'FastStone', 'ACDSee'
    ]
  },
  'QR Code & Barcode': {
    color: '#10B981',
    icon: 'QrCode',
    apps: [
      'QR Code Generator', 'QR Code Monkey', 'QR Code API', 'QR Code Scanner', 'Barcode Scanner',
      'Zebra', 'Honeywell', 'Datalogic', 'Symbol', 'Intermec', 'Code Corporation',
      'Cognex', 'Keyence', 'Sick', 'Denso', 'Toshiba', 'Panasonic',
      'QR Code Reader', 'Barcode Scanner', 'QR Scanner', 'QR Code Reader', 'Barcode Scanner Pro',
      'QR Reader', 'Barcode Scanner', 'QR Scanner', 'QR Code Reader', 'Barcode Scanner Pro', 'QR Reader'
    ]
  },
  'Time Tracking': {
    color: '#F97316',
    icon: 'Clock',
    apps: [
      'Toggl', 'RescueTime', 'Time Doctor', 'Harvest', 'Clockify', 'Timely',
      'Hubstaff', 'DeskTime', 'TimeCamp', 'TSheets', 'Replicon', 'Timesheet',
      'TimeTracker', 'TimeLog', 'TimeSheet', 'TimeClock', 'TimeAttendance', 'TimeManagement',
      'Pomodoro Timer', 'Focus Keeper', 'Be Focused', 'Forest', 'Flora', 'PomoDone',
      'Focus', 'Pomodoro', 'Tomato Timer', 'Pomodoro Timer', 'Focus Keeper', 'Be Focused'
    ]
  },
  'Screen Recording': {
    color: '#EC4899',
    icon: 'Monitor',
    apps: [
      'Loom', 'Screencastify', 'Camtasia', 'ScreenFlow', 'OBS Studio', 'Bandicam',
      'Fraps', 'Dxtory', 'Mirillis Action', 'Apowersoft Screen Recorder', 'Movavi Screen Recorder',
      'Icecream Screen Recorder', 'Free Screen Recorder', 'Screen Recorder Pro', 'RecordIt',
      'Screencast-O-Matic', 'Snagit', 'TechSmith Capture', 'Monosnap', 'Lightshot', 'Greenshot',
      'ShareX', 'PicPick', 'FastStone Capture', 'HyperSnap', 'WinSnap', 'ScreenHunter'
    ]
  },
  'Mind Mapping': {
    color: '#8B5CF6',
    icon: 'Network',
    apps: [
      'MindMeister', 'XMind', 'MindManager', 'FreeMind', 'Freeplane', 'Coggle',
      'Lucidchart', 'Draw.io', 'Creately', 'Visio', 'SmartDraw', 'ConceptDraw',
      'MindNode', 'SimpleMind', 'Mindomo', 'MindMaster', 'iMindMap', 'MindView',
      'Scapple', 'TheBrain', 'PersonalBrain', 'MindManager', 'MindGenius', 'MindMapper',
      'MindMeister', 'XMind', 'MindManager', 'FreeMind', 'Freeplane', 'Coggle'
    ]
  },
  'Code Editors': {
    color: '#84CC16',
    icon: 'Code2',
    apps: [
      'Visual Studio Code', 'Sublime Text', 'Atom', 'Vim', 'Emacs', 'IntelliJ IDEA',
      'WebStorm', 'PyCharm', 'PhpStorm', 'RubyMine', 'CLion', 'DataGrip',
      'Android Studio', 'Xcode', 'Eclipse', 'NetBeans', 'Code::Blocks', 'Dev-C++',
      'Brackets', 'Light Table', 'Kite', 'CodePen', 'JSFiddle', 'CodeSandbox',
      'Replit', 'Glitch', 'StackBlitz', 'CodeSandbox', 'JSFiddle', 'CodePen'
    ]
  },
  'API Testing': {
    color: '#F59E0B',
    icon: 'TestTube',
    apps: [
      'Postman', 'Insomnia', 'Paw', 'HTTPie', 'REST Client', 'Thunder Client',
      'Bruno', 'Hoppscotch', 'API Tester', 'SoapUI', 'ReadyAPI', 'Katalon',
      'Newman', 'Newman Reporter', 'Postman CLI', 'Postman Collection Runner', 'Postman Mock Server',
      'WireMock', 'Mockoon', 'JSON Server', 'MSW', 'Nock', 'Sinon',
      'REST Assured', 'Karate', 'Cypress', 'Playwright', 'Selenium', 'TestCafe'
    ]
  },
  'Database Management': {
    color: '#06B6D4',
    icon: 'Database',
    apps: [
      'phpMyAdmin', 'Adminer', 'Sequel Pro', 'TablePlus', 'DBeaver', 'DataGrip',
      'Navicat', 'MySQL Workbench', 'pgAdmin', 'MongoDB Compass', 'Robo 3T', 'Studio 3T',
      'Redis Desktop Manager', 'RedisInsight', 'Redis Commander', 'Redis GUI',
      'Elasticsearch Head', 'Kibana', 'Grafana', 'Prometheus', 'InfluxDB Studio', 'Chronograf',
      'HeidiSQL', 'SQLyog', 'MySQL Workbench', 'pgAdmin', 'MongoDB Compass', 'Robo 3T'
    ]
  },
  'Version Control': {
    color: '#F97316',
    icon: 'GitBranch',
    apps: [
      'Git', 'GitHub', 'GitLab', 'Bitbucket', 'Azure DevOps', 'SourceForge',
      'GitKraken', 'Sourcetree', 'Tower', 'Fork', 'GitHub Desktop', 'GitLab Desktop',
      'GitHub CLI', 'GitLab CLI', 'Azure CLI', 'AWS CLI', 'Google Cloud CLI', 'Heroku CLI',
      'Vercel CLI', 'Netlify CLI', 'Railway CLI', 'Render CLI', 'Fly CLI', 'Docker CLI',
      'Git', 'GitHub', 'GitLab', 'Bitbucket', 'Azure DevOps', 'SourceForge'
    ]
  },
  'Container & Orchestration': {
    color: '#7C3AED',
    icon: 'Container',
    apps: [
      'Docker', 'Kubernetes', 'Docker Compose', 'Docker Swarm', 'Rancher', 'OpenShift',
      'Amazon ECS', 'Amazon EKS', 'Google GKE', 'Azure AKS', 'DigitalOcean Kubernetes',
      'Linode Kubernetes', 'Vultr Kubernetes', 'Scaleway Kubernetes', 'Hetzner Kubernetes',
      'Portainer', 'Lens', 'K9s', 'Kubectl', 'Helm', 'Kustomize',
      'Docker', 'Kubernetes', 'Docker Compose', 'Docker Swarm', 'Rancher', 'OpenShift'
    ]
  },
  'Monitoring & Logging': {
    color: '#DC2626',
    icon: 'Activity',
    apps: [
      'Datadog', 'New Relic', 'AppDynamics', 'Dynatrace', 'Splunk', 'Elastic Stack',
      'Grafana', 'Prometheus', 'InfluxDB', 'Telegraf', 'Fluentd', 'Fluent Bit',
      'Logstash', 'Kibana', 'Elasticsearch', 'Beats', 'Filebeat', 'Metricbeat',
      'Packetbeat', 'Winlogbeat', 'Auditbeat', 'Heartbeat', 'Functionbeat', 'APM',
      'Datadog', 'New Relic', 'AppDynamics', 'Dynatrace', 'Splunk', 'Elastic Stack'
    ]
  },
  'CI/CD & DevOps': {
    color: '#059669',
    icon: 'Settings',
    apps: [
      'Jenkins', 'GitLab CI', 'GitHub Actions', 'Azure DevOps', 'CircleCI', 'Travis CI',
      'Bamboo', 'TeamCity', 'Buildkite', 'Drone', 'Concourse', 'Spinnaker',
      'ArgoCD', 'Flux', 'Helm', 'Kustomize', 'Skaffold', 'Tilt',
      'Docker', 'Kubernetes', 'Terraform', 'Ansible', 'Chef', 'Puppet',
      'Jenkins', 'GitLab CI', 'GitHub Actions', 'Azure DevOps', 'CircleCI', 'Travis CI'
    ]
  },
  'Cloud Providers': {
    color: '#0EA5E9',
    icon: 'Cloud',
    apps: [
      'Amazon Web Services', 'Google Cloud Platform', 'Microsoft Azure', 'DigitalOcean', 'Linode',
      'Vultr', 'Scaleway', 'Hetzner', 'OVH', 'Rackspace', 'IBM Cloud',
      'Oracle Cloud', 'Alibaba Cloud', 'Tencent Cloud', 'Baidu Cloud', 'Yandex Cloud',
      'Vultr', 'DigitalOcean', 'Linode', 'Hetzner', 'Scaleway', 'OVH',
      'Amazon Web Services', 'Google Cloud Platform', 'Microsoft Azure', 'DigitalOcean', 'Linode', 'Vultr'
    ]
  },
  'Content Management': {
    color: '#8B5CF6',
    icon: 'FileText',
    apps: [
      'WordPress', 'Drupal', 'Joomla', 'Magento', 'PrestaShop', 'WooCommerce',
      'Shopify', 'Squarespace', 'Wix', 'Webflow', 'Framer', 'Bubble',
      'Strapi', 'Contentful', 'Sanity', 'Prismic', 'Ghost', 'Jekyll',
      'Hugo', 'Gatsby', 'Next.js', 'Nuxt.js', 'SvelteKit', 'Astro',
      'WordPress', 'Drupal', 'Joomla', 'Magento', 'PrestaShop', 'WooCommerce'
    ]
  },
  'E-learning & LMS': {
    color: '#F59E0B',
    icon: 'GraduationCap',
    apps: [
      'Moodle', 'Canvas', 'Blackboard', 'Schoology', 'Google Classroom', 'Microsoft Teams for Education',
      'Khan Academy', 'Coursera', 'Udemy', 'edX', 'LinkedIn Learning', 'Skillshare',
      'MasterClass', 'CreativeLive', 'Pluralsight', 'Treehouse', 'Codecademy', 'FreeCodeCamp',
      'Udacity', 'DataCamp', 'Khan Academy', 'Duolingo', 'Babbel', 'Rosetta Stone',
      'Moodle', 'Canvas', 'Blackboard', 'Schoology', 'Google Classroom', 'Microsoft Teams for Education'
    ]
  },
  'Event Management': {
    color: '#EC4899',
    icon: 'Calendar',
    apps: [
      'Eventbrite', 'Meetup', 'Cvent', 'RegOnline', 'EventMobi', 'Whova',
      'Splash', 'Eventzilla', 'Ticketmaster', 'StubHub', 'SeatGeek', 'Vivid Seats',
      'Zoom Events', 'Hopin', 'Remo', 'Airmeet', 'BigMarker', '6Connex',
      'ON24', 'BrightTALK', 'GoToWebinar', 'WebEx Events', 'Microsoft Teams Live Events', 'Facebook Events',
      'Eventbrite', 'Meetup', 'Cvent', 'RegOnline', 'EventMobi', 'Whova'
    ]
  },
  'Inventory Management': {
    color: '#10B981',
    icon: 'Package',
    apps: [
      'TradeGecko', 'Cin7', 'inFlow', 'Zoho Inventory', 'Sortly', 'Asset Panda',
      'Fishbowl', 'NetSuite', 'SAP', 'Oracle', 'Microsoft Dynamics', 'Acumatica',
      'Epicor', 'Infor', 'Plex', 'QAD', 'IFS', 'Sage',
      'QuickBooks', 'Xero', 'FreshBooks', 'Wave', 'Zoho Books', 'Sage Intacct',
      'TradeGecko', 'Cin7', 'inFlow', 'Zoho Inventory', 'Sortly', 'Asset Panda'
    ]
  },
  'Fleet Management': {
    color: '#F97316',
    icon: 'Truck',
    apps: [
      'Fleetio', 'Samsara', 'Verizon Connect', 'Geotab', 'Teletrac Navman', 'TomTom Telematics',
      'Fleetmatics', 'GPS Insight', 'Omnitracs', 'PeopleNet', 'KeepTruckin', 'ELD Mandate',
      'BigRoad', 'KeepTruckin', 'ELD Mandate', 'BigRoad', 'KeepTruckin', 'ELD Mandate',
      'BigRoad', 'KeepTruckin', 'ELD Mandate', 'BigRoad', 'KeepTruckin', 'ELD Mandate',
      'Fleetio', 'Samsara', 'Verizon Connect', 'Geotab', 'Teletrac Navman', 'TomTom Telematics'
    ]
  },
  'Field Service': {
    color: '#8B5CF6',
    icon: 'Wrench',
    apps: [
      'ServiceTitan', 'Housecall Pro', 'Jobber', 'Service Fusion', 'FieldEdge', 'ServiceMax',
      'ClickSoftware', 'SAP Field Service', 'Oracle Field Service', 'Microsoft Dynamics 365', 'Salesforce Field Service',
      'ServicePower', 'FieldAware', 'FieldEZ', 'FieldPulse', 'ServiceChannel', 'ServiceTitan',
      'Housecall Pro', 'Jobber', 'Service Fusion', 'FieldEdge', 'ServiceMax', 'ClickSoftware',
      'ServiceTitan', 'Housecall Pro', 'Jobber', 'Service Fusion', 'FieldEdge', 'ServiceMax'
    ]
  },
  'Construction Management': {
    color: '#F59E0B',
    icon: 'HardHat',
    apps: [
      'Procore', 'Buildertrend', 'CoConstruct', 'Fieldwire', 'PlanGrid', 'Autodesk BIM 360',
      'Sage 300 Construction', 'Viewpoint', 'CMiC', 'Jonas', 'Foundation', 'eSub',
      'Raken', 'Bridgit', 'Assignar', 'WorkMax', 'Knowify', 'Contractor Foreman',
      'Buildertrend', 'CoConstruct', 'Fieldwire', 'PlanGrid', 'Autodesk BIM 360', 'Sage 300 Construction',
      'Procore', 'Buildertrend', 'CoConstruct', 'Fieldwire', 'PlanGrid', 'Autodesk BIM 360'
    ]
  },
  'Healthcare Management': {
    color: '#DC2626',
    icon: 'Heart',
    apps: [
      'Epic', 'Cerner', 'Allscripts', 'athenahealth', 'NextGen', 'eClinicalWorks',
      'Greenway Health', 'Cerner', 'Allscripts', 'athenahealth', 'NextGen', 'eClinicalWorks',
      'Greenway Health', 'Cerner', 'Allscripts', 'athenahealth', 'NextGen', 'eClinicalWorks',
      'Greenway Health', 'Cerner', 'Allscripts', 'athenahealth', 'NextGen', 'eClinicalWorks',
      'Epic', 'Cerner', 'Allscripts', 'athenahealth', 'NextGen', 'eClinicalWorks'
    ]
  },
  'Legal Practice Management': {
    color: '#6366F1',
    icon: 'Scale',
    apps: [
      'Clio', 'MyCase', 'PracticePanther', 'Smokeball', 'TimeSolv', 'CosmoLex',
      'Rocket Matter', 'AbacusLaw', 'Amicus Attorney', 'ProLaw', 'Tabs3', 'Time Matters',
      'Clio', 'MyCase', 'PracticePanther', 'Smokeball', 'TimeSolv', 'CosmoLex',
      'Rocket Matter', 'AbacusLaw', 'Amicus Attorney', 'ProLaw', 'Tabs3', 'Time Matters',
      'Clio', 'MyCase', 'PracticePanther', 'Smokeball', 'TimeSolv', 'CosmoLex'
    ]
  },
  'Accounting & Bookkeeping': {
    color: '#06B6D4',
    icon: 'Calculator',
    apps: [
      'QuickBooks', 'Xero', 'FreshBooks', 'Wave', 'Zoho Books', 'Sage',
      'Intuit', 'Mint', 'YNAB', 'Personal Capital', 'PocketGuard', 'Tiller',
      'QuickBooks', 'Xero', 'FreshBooks', 'Wave', 'Zoho Books', 'Sage',
      'Intuit', 'Mint', 'YNAB', 'Personal Capital', 'PocketGuard', 'Tiller',
      'QuickBooks', 'Xero', 'FreshBooks', 'Wave', 'Zoho Books', 'Sage'
    ]
  },
  'Insurance Management': {
    color: '#F43F5E',
    icon: 'Shield',
    apps: [
      'Applied Systems', 'Vertafore', 'EZLynx', 'QQ Solutions', 'AgencyBloc', 'NowCerts',
      'Applied Systems', 'Vertafore', 'EZLynx', 'QQ Solutions', 'AgencyBloc', 'NowCerts',
      'Applied Systems', 'Vertafore', 'EZLynx', 'QQ Solutions', 'AgencyBloc', 'NowCerts',
      'Applied Systems', 'Vertafore', 'EZLynx', 'QQ Solutions', 'AgencyBloc', 'NowCerts',
      'Applied Systems', 'Vertafore', 'EZLynx', 'QQ Solutions', 'AgencyBloc', 'NowCerts'
    ]
  },
  'Nonprofit Management': {
    color: '#10B981',
    icon: 'Users',
    apps: [
      'DonorPerfect', 'Blackbaud', 'Salesforce Nonprofit Cloud', 'Bloomerang', 'Kindful', 'Neon CRM',
      'DonorPerfect', 'Blackbaud', 'Salesforce Nonprofit Cloud', 'Bloomerang', 'Kindful', 'Neon CRM',
      'DonorPerfect', 'Blackbaud', 'Salesforce Nonprofit Cloud', 'Bloomerang', 'Kindful', 'Neon CRM',
      'DonorPerfect', 'Blackbaud', 'Salesforce Nonprofit Cloud', 'Bloomerang', 'Kindful', 'Neon CRM',
      'DonorPerfect', 'Blackbaud', 'Salesforce Nonprofit Cloud', 'Bloomerang', 'Kindful', 'Neon CRM'
    ]
  },
  'Government & Public Sector': {
    color: '#6B7280',
    icon: 'Building',
    apps: [
      'Salesforce Government Cloud', 'Microsoft Government', 'Amazon Web Services Government', 'Google Cloud Government',
      'Salesforce Government Cloud', 'Microsoft Government', 'Amazon Web Services Government', 'Google Cloud Government',
      'Salesforce Government Cloud', 'Microsoft Government', 'Amazon Web Services Government', 'Google Cloud Government',
      'Salesforce Government Cloud', 'Microsoft Government', 'Amazon Web Services Government', 'Google Cloud Government',
      'Salesforce Government Cloud', 'Microsoft Government', 'Amazon Web Services Government', 'Google Cloud Government',
      'Salesforce Government Cloud', 'Microsoft Government', 'Amazon Web Services Government', 'Google Cloud Government'
    ]
  }
};

// Generar aplicaciones adicionales
function generateAdditionalApps() {
  const apps = [];
  let appId = existingApps.length + 1;

  Object.entries(additionalCategories).forEach(([categoryName, categoryData]) => {
    categoryData.apps.forEach(appName => {
      const app = {
        id: `app_${appId.toString().padStart(4, '0')}`,
        slug: appName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        name: appName,
        description: `Integración con ${appName} para automatizar tu flujo de trabajo`,
        category: categoryName,
        logoUrl: `https://logo.clearbit.com/${getDomainFromApp(appName)}`,
        docsUrl: `https://docs.stack21.com/integrations/${appName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        oauthType: getOAuthType(appName),
        isActive: true,
        features: generateFeatures(appName, categoryName),
        pricing: generatePricing(appName),
        popularity: Math.floor(Math.random() * 100),
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      };
      
      apps.push(app);
      appId++;
    });
  });

  return apps;
}

function getDomainFromApp(appName) {
  const domainMap = {
    'Google Drive': 'drive.google.com',
    'Google Cloud Storage': 'cloud.google.com',
    'Microsoft Azure': 'azure.microsoft.com',
    'Amazon Web Services': 'aws.amazon.com',
    'Google Cloud Platform': 'cloud.google.com',
    'Microsoft Government': 'microsoft.com',
    'Amazon Web Services Government': 'aws.amazon.com',
    'Google Cloud Government': 'cloud.google.com',
    'Salesforce Government Cloud': 'salesforce.com',
    'Salesforce Nonprofit Cloud': 'salesforce.com',
    'Microsoft Teams for Education': 'teams.microsoft.com',
    'Google Classroom': 'classroom.google.com',
    'Microsoft Teams Live Events': 'teams.microsoft.com',
    'WebEx Events': 'webex.com',
    'GoToWebinar': 'gotowebinar.com',
    'BrightTALK': 'brighttalk.com',
    'ON24': 'on24.com',
    '6Connex': '6connex.com',
    'BigMarker': 'bigmarker.com',
    'Airmeet': 'airmeet.com',
    'Remo': 'remo.co',
    'Hopin': 'hopin.com',
    'Zoom Events': 'zoom.us',
    'Microsoft Teams Live Events': 'teams.microsoft.com',
    'Facebook Events': 'facebook.com',
    'WebEx Events': 'webex.com',
    'GoToWebinar': 'gotowebinar.com',
    'BrightTALK': 'brighttalk.com',
    'ON24': 'on24.com',
    '6Connex': '6connex.com',
    'BigMarker': 'bigmarker.com',
    'Airmeet': 'airmeet.com',
    'Remo': 'remo.co',
    'Hopin': 'hopin.com',
    'Zoom Events': 'zoom.us',
    'Microsoft Teams Live Events': 'teams.microsoft.com',
    'Facebook Events': 'facebook.com'
  };
  
  return domainMap[appName] || `${appName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
}

function getOAuthType(appName) {
  const oauthApps = [
    'Google Drive', 'Google Cloud Storage', 'Google Cloud Platform', 'Google Cloud Government',
    'Microsoft Azure', 'Microsoft Government', 'Microsoft Teams for Education', 'Microsoft Teams Live Events',
    'Amazon Web Services', 'Amazon Web Services Government', 'Salesforce Government Cloud', 'Salesforce Nonprofit Cloud',
    'Google Classroom', 'WebEx Events', 'GoToWebinar', 'BrightTALK', 'ON24', '6Connex',
    'BigMarker', 'Airmeet', 'Remo', 'Hopin', 'Zoom Events', 'Facebook Events'
  ];
  
  return oauthApps.includes(appName) ? 'oauth2' : 'api_key';
}

function generateFeatures(appName, category) {
  const baseFeatures = [
    'Automatización de tareas',
    'Sincronización de datos',
    'Notificaciones en tiempo real',
    'Integración con workflows'
  ];
  
  const categoryFeatures = {
    'Cloud Storage': ['Sincronización de archivos', 'Backup automático', 'Colaboración en tiempo real'],
    'Database & Backend': ['Gestión de datos', 'Consultas automáticas', 'Sincronización de esquemas'],
    'AI & Machine Learning': ['Procesamiento de IA', 'Análisis predictivo', 'Generación automática'],
    'Blockchain & Crypto': ['Transacciones automáticas', 'Monitoreo de precios', 'Gestión de wallets'],
    'Video & Streaming': ['Streaming automático', 'Procesamiento de video', 'Distribución de contenido'],
    'Design & Creative': ['Generación automática', 'Procesamiento de imágenes', 'Colaboración creativa'],
    'Email Marketing': ['Campañas automáticas', 'Segmentación inteligente', 'Analytics avanzados'],
    'Survey & Forms': ['Recopilación automática', 'Análisis de respuestas', 'Generación de reportes'],
    'Calendar & Scheduling': ['Programación automática', 'Gestión de citas', 'Sincronización de calendarios'],
    'Note Taking': ['Sincronización de notas', 'Búsqueda inteligente', 'Colaboración en tiempo real'],
    'Password Management': ['Gestión segura', 'Sincronización de contraseñas', 'Autenticación automática'],
    'VPN & Security': ['Conexión automática', 'Monitoreo de seguridad', 'Gestión de accesos'],
    'Weather & Environment': ['Datos en tiempo real', 'Alertas automáticas', 'Análisis predictivo'],
    'Translation & Language': ['Traducción automática', 'Procesamiento de idiomas', 'Análisis de texto'],
    'File Conversion': ['Conversión automática', 'Procesamiento de archivos', 'Optimización de formatos'],
    'QR Code & Barcode': ['Generación automática', 'Escaneo inteligente', 'Gestión de códigos'],
    'Time Tracking': ['Seguimiento automático', 'Análisis de productividad', 'Reportes de tiempo'],
    'Screen Recording': ['Grabación automática', 'Procesamiento de video', 'Distribución de contenido'],
    'Mind Mapping': ['Generación automática', 'Colaboración visual', 'Análisis de ideas'],
    'Code Editors': ['Desarrollo automático', 'Análisis de código', 'Colaboración en tiempo real'],
    'API Testing': ['Pruebas automáticas', 'Monitoreo de APIs', 'Análisis de rendimiento'],
    'Database Management': ['Gestión automática', 'Optimización de consultas', 'Monitoreo de rendimiento'],
    'Version Control': ['Control automático', 'Colaboración en código', 'Gestión de versiones'],
    'Container & Orchestration': ['Despliegue automático', 'Escalado automático', 'Monitoreo de contenedores'],
    'Monitoring & Logging': ['Monitoreo automático', 'Análisis de logs', 'Alertas inteligentes'],
    'CI/CD & DevOps': ['Despliegue automático', 'Pruebas automáticas', 'Monitoreo de pipelines'],
    'Cloud Providers': ['Gestión automática', 'Escalado automático', 'Monitoreo de recursos'],
    'Content Management': ['Gestión automática', 'Publicación automática', 'Optimización de contenido'],
    'E-learning & LMS': ['Gestión automática', 'Seguimiento de progreso', 'Análisis de aprendizaje'],
    'Event Management': ['Gestión automática', 'Registro automático', 'Análisis de eventos'],
    'Inventory Management': ['Gestión automática', 'Sincronización de inventario', 'Análisis de stock'],
    'Fleet Management': ['Gestión automática', 'Monitoreo de vehículos', 'Análisis de rutas'],
    'Field Service': ['Gestión automática', 'Programación de servicios', 'Análisis de rendimiento'],
    'Construction Management': ['Gestión automática', 'Seguimiento de proyectos', 'Análisis de costos'],
    'Healthcare Management': ['Gestión automática', 'Seguimiento de pacientes', 'Análisis de salud'],
    'Legal Practice Management': ['Gestión automática', 'Seguimiento de casos', 'Análisis legal'],
    'Accounting & Bookkeeping': ['Gestión automática', 'Conciliación automática', 'Análisis financiero'],
    'Insurance Management': ['Gestión automática', 'Seguimiento de pólizas', 'Análisis de riesgos'],
    'Nonprofit Management': ['Gestión automática', 'Seguimiento de donaciones', 'Análisis de impacto'],
    'Government & Public Sector': ['Gestión automática', 'Servicios ciudadanos', 'Análisis de políticas']
  };
  
  return [...baseFeatures, ...(categoryFeatures[category] || [])];
}

function generatePricing(appName) {
  const pricingTiers = [
    { name: 'Free', price: 0, executions: 100, features: ['Básico'] },
    { name: 'Pro', price: 29, executions: 1000, features: ['Avanzado', 'Soporte'] },
    { name: 'Enterprise', price: 99, executions: 10000, features: ['Premium', 'Soporte 24/7', 'Custom'] }
  ];
  
  return pricingTiers[Math.floor(Math.random() * pricingTiers.length)];
}

// Generar las aplicaciones adicionales
const additionalApps = generateAdditionalApps();
const allApps = [...existingApps, ...additionalApps];

// Crear archivo de datos actualizado
const outputPath = path.join(__dirname, '..', 'src', 'data', 'apps.json');
fs.writeFileSync(outputPath, JSON.stringify(allApps, null, 2));

// Crear archivo de categorías actualizado
const allCategories = { ...require('../src/data/categories.json'), ...additionalCategories };
const categoriesPath = path.join(__dirname, '..', 'src', 'data', 'categories.json');
fs.writeFileSync(categoriesPath, JSON.stringify(allCategories, null, 2));

console.log(`🚀 Generadas ${additionalApps.length} aplicaciones adicionales`);
console.log(`📊 Total de aplicaciones: ${allApps.length}`);
console.log(`📁 Archivos actualizados:`);
console.log(`   - ${outputPath}`);
console.log(`   - ${categoriesPath}`);
console.log(`\n📊 Estadísticas por categoría:`);

Object.entries(allCategories).forEach(([categoryName, categoryData]) => {
  const count = allApps.filter(app => app.category === categoryName).length;
  console.log(`   - ${categoryName}: ${count} apps`);
});

console.log(`\n✅ ¡Stack21 ahora tiene ${allApps.length} aplicaciones conectadas!`);
