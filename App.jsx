import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Radio, Trophy, Search, Sparkles, RefreshCw } from 'lucide-react'

const seedNodes = [
  {
    id: 'node-001',
    name: 'Hilltop Relay',
    hardware: 'Heltec V3',
    region: 'Kildare',
    rarity: 'Rare',
    description: 'Long-range elevated node with excellent line-of-sight.',
    logo: '⛰️',
    points: 120,
  },
  {
    id: 'node-002',
    name: 'Town Link',
    hardware: 'T-Beam',
    region: 'Naas',
    rarity: 'Common',
    description: 'Busy local node often seen during town walks.',
    logo: '🏘️',
    points: 40,
  },
  {
    id: 'node-003',
    name: 'River Watch',
    hardware: 'RAK WisBlock',
    region: 'Newbridge',
    rarity: 'Epic',
    description: 'Well-tuned solar node near the river trail.',
    logo: '🌊',
    points: 200,
  },
  {
    id: 'node-004',
    name: 'Workshop Beacon',
    hardware: 'LilyGo T-Echo',
    region: 'Dublin',
    rarity: 'Uncommon',
    description: 'Compact handheld node from a maker meetup.',
    logo: '🛠️',
    points: 80,
  },
  {
    id: 'node-005',
    name: 'Cafe Mesh',
    hardware: 'Station G2',
    region: 'Galway',
    rarity: 'Legendary',
    description: 'A sponsor-hosted public node with custom branding.',
    logo: '☕',
    points: 350,
  },
  {
    id: 'node-006',
    name: 'Forest Edge',
    hardware: 'Heltec Capsule',
    region: 'Wicklow',
    rarity: 'Rare',
    description: 'Intermittent trail node that appears on weekend hikes.',
    logo: '🌲',
    points: 130,
  },
]

const rarityClass = {
  Common: 'badge common',
  Uncommon: 'badge uncommon',
  Rare: 'badge rare',
  Epic: 'badge epic',
  Legendary: 'badge legendary',
}

function scoreLevel(points) {
  if (points >= 800) return { level: 5, title: 'Mesh Legend' }
  if (points >= 500) return { level: 4, title: 'Signal Hunter' }
  if (points >= 250) return { level: 3, title: 'Node Scout' }
  if (points >= 100) return { level: 2, title: 'Packet Walker' }
  return { level: 1, title: 'New Listener' }
}

export default function App() {
  const [collection, setCollection] = useState([])
  const [nearby, setNearby] = useState(seedNodes.slice(0, 4))
  const [query, setQuery] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('mesh-node-collection')
    if (!saved) return

    try {
      setCollection(JSON.parse(saved))
    } catch (error) {
      console.error('Failed to load local collection', error)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('mesh-node-collection', JSON.stringify(collection))
  }, [collection])

  const collectedIds = new Set(collection.map((node) => node.id))
  const totalPoints = collection.reduce((sum, node) => sum + node.points, 0)
  const rank = scoreLevel(totalPoints)
  const progressTarget = rank.level === 5 ? 1000 : [100, 250, 500, 800, 1000][rank.level - 1]
  const progress = Math.min(100, Math.round((totalPoints / progressTarget) * 100))

  const filteredNearby = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return nearby

    return nearby.filter((node) => {
      const text = `${node.name} ${node.hardware} ${node.region} ${node.rarity}`.toLowerCase()
      return text.includes(normalizedQuery)
    })
  }, [nearby, query])

  function refreshNearby() {
    const shuffled = [...seedNodes].sort(() => Math.random() - 0.5)
    setNearby(shuffled.slice(0, 4))
  }

  function collectNode(node) {
    if (collectedIds.has(node.id)) return
    setCollection((prev) => [node, ...prev])
  }

  return (
    <div className="page-shell">
      <div className="container">
        <div className="grid-top">
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="panel hero-panel"
          >
            <div className="pill">
              <Sparkles size={16} />
              Mesh Node Collector
            </div>
            <h1>Pokémon GO for Meshtastic nodes</h1>
            <p>
              Discover nearby nodes, collect profile cards, and build a living local mesh collection.
            </p>
            <button className="primary-button" onClick={refreshNearby}>
              <RefreshCw size={18} />
              Refresh Nearby
            </button>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="panel stats-panel"
          >
            <div className="section-title">
              <Trophy size={20} />
              Your Rank
            </div>
            <div className="rank-value">Level {rank.level}</div>
            <div className="rank-title">{rank.title}</div>
            <div className="progress-row">
              <span>{totalPoints} points</span>
              <span>{progress}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="stats-grid">
              <div className="stat-box">
                <div className="stat-label">Collected</div>
                <div className="stat-value">{collection.length}</div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Seen Nearby</div>
                <div className="stat-value">{nearby.length}</div>
              </div>
            </div>
          </motion.section>
        </div>

        <div className="grid-main">
          <section className="panel">
            <div className="panel-header">
              <div className="section-title">
                <Radio size={20} />
                Nearby Discoveries
              </div>
              <div className="search-box">
                <Search size={16} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search nearby nodes"
                />
              </div>
            </div>

            <div className="card-grid">
              {filteredNearby.map((node, index) => {
                const alreadyCollected = collectedIds.has(node.id)

                return (
                  <motion.article
                    key={node.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="node-card"
                  >
                    <div className="node-card-top">
                      <div className="node-logo">{node.logo}</div>
                      <span className={rarityClass[node.rarity]}>{node.rarity}</span>
                    </div>
                    <h3>{node.name}</h3>
                    <div className="node-row muted">
                      <MapPin size={14} />
                      {node.region}
                    </div>
                    <div className="muted">{node.hardware}</div>
                    <p>{node.description}</p>
                    <div className="node-card-bottom">
                      <strong>+{node.points} pts</strong>
                      <button
                        className={alreadyCollected ? 'secondary-button' : 'primary-button small'}
                        onClick={() => collectNode(node)}
                        disabled={alreadyCollected}
                      >
                        {alreadyCollected ? 'Collected' : 'Collect Card'}
                      </button>
                    </div>
                  </motion.article>
                )
              })}
            </div>
          </section>

          <section className="panel">
            <div className="panel-header">
              <div className="section-title">Your Collection</div>
            </div>

            {collection.length === 0 ? (
              <div className="empty-state">No nodes collected yet. Start with the nearby list.</div>
            ) : (
              <div className="collection-list">
                {collection.map((node, index) => (
                  <motion.div
                    key={node.id}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className="collection-item"
                  >
                    <div className="collection-left">
                      <div className="node-logo small">{node.logo}</div>
                      <div>
                        <div className="collection-name">{node.name}</div>
                        <div className="muted">
                          {node.hardware} · {node.region}
                        </div>
                      </div>
                    </div>
                    <span className={rarityClass[node.rarity]}>{node.rarity}</span>
                  </motion.div>
                ))}
              </div>
            )}
          </section>
        </div>

        <section className="panel roadmap-panel">
          <div className="panel-header">
            <div className="section-title">MVP roadmap</div>
          </div>
          <div className="roadmap-grid">
            <div className="roadmap-card">
              <div className="roadmap-phase">Phase 1</div>
              <p>GitHub-hosted PWA with collectible node cards, local storage, profile pages, and manual imports.</p>
            </div>
            <div className="roadmap-card">
              <div className="roadmap-phase">Phase 2</div>
              <p>Live Meshtastic integration for discovered nodes, packet metadata, and optional owner-submitted details.</p>
            </div>
            <div className="roadmap-card">
              <div className="roadmap-phase">Phase 3</div>
              <p>Map view, badges, rare drops, business-hosted sponsor nodes, and optional account sync.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
