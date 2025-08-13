import { Twitter } from 'lucide-react'

interface TeamProps {
  team: Array<{
    name: string
    role: string
    avatar: string
    social?: string
  }>
  primaryColor: string
  secondaryColor: string
  accentColor: string
}

export const Team = ({ team, primaryColor, secondaryColor, accentColor }: TeamProps) => {
  return (
    <section className="py-20 bg-black/30" id="team">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 
            className="text-4xl md:text-5xl font-bold mb-6 neon-text"
            style={{ color: primaryColor }}
          >
            Our Team
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Meet the passionate team behind our success
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <div key={index} className="text-center p-8 rounded-2xl neon-border neon-hover">
              <div 
                className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center text-2xl font-bold text-white neon-glow"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
                }}
              >
                {member.avatar && /^https?:\/\//.test(member.avatar) ? (
                  <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span aria-hidden>
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{member.name}</h3>
              <p className="text-gray-300 mb-4">{member.role}</p>
              {member.social && (
                <a 
                  href={member.social}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 hover:scale-110"
                  style={{ 
                    backgroundColor: `${primaryColor}20`,
                    color: primaryColor
                  }}
                >
                  <Twitter className="w-5 h-5" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
