'use client'

import { useState } from 'react'

const eventTypes = [
  { 
    id: 'wedding', 
    label: 'Wedding',
    fields: ['brideName', 'groomName']
  },
  { 
    id: 'reception', 
    label: 'Reception',
    fields: ['brideName', 'groomName']
  },
  { 
    id: 'engagement', 
    label: 'Engagement',
    fields: ['brideName', 'groomName']
  },
  { 
    id: 'haldi', 
    label: 'Haldi Ceremony',
    fields: ['brideName', 'groomName']
  },
  { 
    id: 'mundan', 
    label: 'Mundan Ceremony',
    fields: ['childName']
  },
  { 
    id: 'khatna', 
    label: 'Khatna Ceremony',
    fields: ['childName']
  },
  { 
    id: 'baptism', 
    label: 'Baptism Ceremony',
    fields: ['childName']
  },
  { 
    id: 'hackathon', 
    label: 'Hackathon',
    fields: ['eventName']
  },
  { 
    id: 'convention', 
    label: 'Convention',
    fields: ['eventName']
  },
  { 
    id: 'fest', 
    label: 'College Fest',
    fields: ['eventName']
  },
  { 
    id: 'other', 
    label: 'Other Event',
    fields: ['eventName']
  }
]

export default function Home() {
  const [eventType, setEventType] = useState('')
  const [formData, setFormData] = useState({
    brideName: '',
    groomName: '',
    childName: '',
    eventName: '',
    date: ''
  })
  const [hashtags, setHashtags] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const selectedEventType = eventTypes.find(type => type.id === eventType)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const generateHashtags = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventType,
          ...formData
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate hashtags')
      }

      const data = await response.json()
      setHashtags(data.hashtags)
    } catch (error) {
      console.error('Error generating hashtags:', error)
      setError('Failed to generate hashtags. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen">
      {/* Background Video */}
      <div className="fixed inset-0 w-screen h-screen">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
          style={{
            opacity: 0.9
          }}
        >
          <source src="/events-bg.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Content */}
      <div className="relative min-h-screen bg-white/0 backdrop-blur-none">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-center mb-8 text-primary-600">
            Event Hashtag Generator
          </h1>
          
          <div className="max-w-2xl mx-auto bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Type
                </label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select an event type</option>
                  {eventTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {selectedEventType?.fields.map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field === 'brideName' ? 'Bride Name' :
                     field === 'groomName' ? 'Groom Name' :
                     field === 'childName' ? 'Child Name' :
                     'Event Name'}
                  </label>
                  <input
                    type="text"
                    value={formData[field as keyof typeof formData]}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    placeholder={`Enter ${field === 'brideName' ? 'bride' :
                                field === 'groomName' ? 'groom' :
                                field === 'childName' ? 'child' : 'event'} name`}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date (Optional)
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <button
                onClick={generateHashtags}
                disabled={loading || !eventType || !selectedEventType?.fields.some(field => formData[field as keyof typeof formData])}
                className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Generating...' : 'Generate Hashtags'}
              </button>

              {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
              )}
            </div>

            {hashtags.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Generated Hashtags</h2>
                <div className="flex flex-wrap gap-2">
                  {hashtags.map((hashtag, index) => (
                    <div
                      key={index}
                      className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full cursor-pointer hover:bg-primary-200"
                      onClick={() => {
                        navigator.clipboard.writeText(hashtag)
                        // TODO: Add toast notification for copy success
                      }}
                    >
                      {hashtag}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
} 