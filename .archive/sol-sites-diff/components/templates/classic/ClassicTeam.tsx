import { X } from 'lucide-react'

interface ClassicTeamProps {
  content?: {
    title?: string
    description?: string
    members?: Array<{
      name: string
      role: string
      avatar: string
      social?: string
    }>
  }
  primaryColor: string
  secondaryColor: string
  accentColor: string
}

export const ClassicTeam = ({ content = {}, primaryColor, secondaryColor, accentColor }: ClassicTeamProps) => {
  const members = content.members || [
    { name: 'Alex Johnson', role: 'Founder & CEO', avatar: '👨', social: '' },
    { name: 'Sarah Chen', role: 'Lead Developer', avatar: '👩', social: '' },
    { name: 'Mike Rodriguez', role: 'Marketing Director', avatar: '👨', social: '' }
  ]

  return (
    <section className="py-20 bg-gray-50" id="team">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: primaryColor }}
          >
            {content.title || 'Our Team'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {content.description || 'Meet the passionate team behind our success'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {members.map((member, index) => (
            <div key={index} className="text-center p-8 rounded-2xl bg-white classic-hover classic-shadow">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden">
                {member.avatar && (member.avatar.startsWith('data:') || /^https?:\/\//.test(member.avatar)) ? (
                  <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                    <span className="text-gray-400 text-2xl font-semibold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                )}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
              <p className="text-gray-600 mb-4">{member.role}</p>
              <a 
                href={member.social || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 hover:scale-110"
                style={{ 
                  backgroundColor: `${primaryColor}20`,
                  color: primaryColor
                }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
