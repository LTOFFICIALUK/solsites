"use client"

import { Twitter, Linkedin, Globe } from 'lucide-react'

interface MinimalTeamProps {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  content: {
    team: Array<{
      name: string
      role: string
      avatar: string
      social?: string
    }>
  }
}

export function MinimalTeam({ primaryColor, secondaryColor, accentColor, content }: MinimalTeamProps) {
  return (
    <section className="py-20 bg-white" id="team">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: primaryColor }}
          >
            Meet Our Team
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The passionate minds behind our mission to revolutionize decentralized finance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.team.map((member, index) => (
            <div 
              key={index}
              className="text-center group"
            >
              {/* Avatar */}
              <div className="relative mb-6">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-gray-200 group-hover:border-gray-300 transition-colors">
                  {member.avatar && /^https?:\/\//.test(member.avatar) ? (
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-semibold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                </div>
                
                {/* Social Link */}
                {member.social && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <a
                      href={member.social}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full shadow-md transition-all duration-200 hover:scale-110"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {member.social.includes('twitter') ? (
                        <Twitter className="w-4 h-4 text-white" />
                      ) : member.social.includes('linkedin') ? (
                        <Linkedin className="w-4 h-4 text-white" />
                      ) : (
                        <Globe className="w-4 h-4 text-white" />
                      )}
                    </a>
                  </div>
                )}
              </div>

              {/* Member Info */}
              <div>
                <h3 
                  className="text-xl font-semibold mb-2"
                  style={{ color: primaryColor }}
                >
                  {member.name}
                </h3>
                <p 
                  className="text-lg font-medium mb-4"
                  style={{ color: secondaryColor }}
                >
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Team Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <div 
              className="text-3xl font-bold mb-2"
              style={{ color: primaryColor }}
            >
              {content.team.length}+
            </div>
            <p className="text-gray-600">Team Members</p>
          </div>
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <div 
              className="text-3xl font-bold mb-2"
              style={{ color: secondaryColor }}
            >
              10+
            </div>
            <p className="text-gray-600">Years Experience</p>
          </div>
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <div 
              className="text-3xl font-bold mb-2"
              style={{ color: accentColor }}
            >
              50+
            </div>
            <p className="text-gray-600">Projects Delivered</p>
          </div>
        </div>
      </div>
    </section>
  )
}
