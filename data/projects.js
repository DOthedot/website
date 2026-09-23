// The projects listing, in the order it appears on /projects.
// `repo` is optional; omit `url` external-ness by setting `internal: true`.
module.exports = [
  {
    name: 'byebyenotes',
    url: 'https://byebyenotes.com',
    repo: 'https://github.com/DOthedot/byebyenotes',
    description: 'An extremely fast browser-based note-taking app. Notes live entirely in the URL via LZ compression — terminal-like, highly customizable, instantly shareable.'
  },
  {
    name: 'table deps',
    url: 'https://table-deps.vercel.app',
    repo: 'https://github.com/DOthedot/table_deps',
    description: 'Figures out table dependencies in a SQL query, with a UI for graph overview.'
  },
  {
    name: 'nyc-taxi data pipeline',
    url: 'https://github.com/DOthedot/nyc_taxi_cc',
    repo: 'https://github.com/DOthedot/nyc_taxi_cc',
    description: 'A complete data engineering pipeline that ingests taxi ride data through different data sources, processes it and give a 3rd eye view on the business performance using super clean dashboarding.<br>PS : its really good , have a look !!!'
  },
  {
    name: 'advanced rag',
    url: 'https://github.com/DOthedot/advanced_rag',
    repo: 'https://github.com/DOthedot/advanced_rag',
    description: 'A Hybrid RAG system combining vector search, knowledge graphs, user memory, and local LLMs for retrieval-augmented generation.'
  },
  {
    name: 'realtime data processing pipeline',
    url: 'https://github.com/DOthedot/realtime_dataprocessing_pipeline',
    repo: 'https://github.com/DOthedot/realtime_dataprocessing_pipeline',
    description: 'Mimics stock tick data through random walks and processes it in real time using Kafka, Flink, and ScyllaDB.'
  },
  {
    name: 'personal website',
    url: 'https://github.com/DOthedot/website',
    repo: 'https://github.com/DOthedot/website',
    description: "It's the website, you are looking at right now. Used minimalist design with a JavaScript backend (Node.js + Nunjucks), monospace fonts and couple of other technologies."
  },
  {
    name: 'literary works',
    url: '/literary',
    internal: true,
    description: 'Collection of literary works including writings on philosophy, physics, and technology.'
  }
];
