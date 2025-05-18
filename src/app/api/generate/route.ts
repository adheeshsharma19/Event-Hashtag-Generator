import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const hashtagSchema = z.object({
  eventType: z.string(),
  brideName: z.string().optional(),
  groomName: z.string().optional(),
  childName: z.string().optional(),
  eventName: z.string().optional(),
  date: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = hashtagSchema.parse(body)

    // Get or create event type
    const eventTypeRecord = await prisma.eventType.upsert({
      where: { name: data.eventType },
      update: {},
      create: { name: data.eventType },
    })

    let hashtags: string[] = []

    // Generate hashtags based on event type
    switch (data.eventType) {
      case 'wedding':
      case 'reception':
      case 'engagement':
      case 'haldi':
        if (data.brideName && data.groomName) {
          const brideName = data.brideName.replace(/\s+/g, '')
          const groomName = data.groomName.replace(/\s+/g, '')
          hashtags = [
            `#${data.eventType}${brideName}${groomName}`,
            `#${data.eventType}Of${brideName}And${groomName}`,
            `#${brideName}${groomName}${data.eventType}`,
            `#${data.eventType}Celebration`,
            `#${data.eventType}Vibes`,
            `#${data.eventType}Day`,
            `#${data.eventType}Moments`,
            `#${data.eventType}Memories`,
          ]
        }
        break

      case 'mundan':
      case 'khatna':
      case 'baptism':
        if (data.childName) {
          const childName = data.childName.replace(/\s+/g, '')
          hashtags = [
            `#${data.eventType}${childName}`,
            `#${childName}${data.eventType}`,
            `#${data.eventType}Ceremony`,
            `#${data.eventType}Celebration`,
            `#${data.eventType}Day`,
            `#${data.eventType}Moments`,
          ]
        }
        break

      case 'hackathon':
      case 'convention':
      case 'fest':
        if (data.eventName) {
          const eventName = data.eventName.replace(/\s+/g, '')
          hashtags = [
            `#${data.eventType}${eventName}`,
            `#${eventName}${data.eventType}`,
            `#${data.eventType}2024`,
            `#${data.eventType}Event`,
            `#${data.eventType}Vibes`,
            `#${data.eventType}Community`,
          ]
        }
        break

      default:
        if (data.eventName) {
          const eventName = data.eventName.replace(/\s+/g, '')
          hashtags = [
            `#${data.eventType}${eventName}`,
            `#${eventName}${data.eventType}`,
            `#${data.eventType}Event`,
            `#${data.eventType}Celebration`,
            `#${data.eventType}Vibes`,
          ]
        }
    }

    // Add date-specific hashtags if date is provided
    if (data.date) {
      const formattedDate = new Date(data.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
      hashtags.push(
        `#${data.eventType}${formattedDate.replace(/\s+/g, '')}`,
        `#${data.eventType}${formattedDate.split(' ')[0]}${formattedDate.split(' ')[1]}`
      )
    }

    // Add trending hashtags based on event type
    const trendingHashtags = {
      wedding: ['#WeddingDay', '#WeddingBells', '#WeddingCelebration', '#WeddingVibes', '#WeddingMoments'],
      reception: ['#ReceptionParty', '#ReceptionCelebration', '#ReceptionVibes', '#ReceptionMoments'],
      engagement: ['#EngagementParty', '#EngagementCelebration', '#EngagementVibes', '#EngagementMoments'],
      haldi: ['#HaldiCeremony', '#HaldiCelebration', '#HaldiVibes', '#HaldiMoments'],
      mundan: ['#MundanCeremony', '#MundanCelebration', '#MundanVibes', '#MundanMoments'],
      khatna: ['#KhatnaCeremony', '#KhatnaCelebration', '#KhatnaVibes', '#KhatnaMoments'],
      baptism: ['#BaptismCeremony', '#BaptismCelebration', '#BaptismVibes', '#BaptismMoments'],
      hackathon: ['#Hackathon', '#CodingLife', '#TechEvent', '#Innovation', '#TechCommunity'],
      convention: ['#Convention', '#Networking', '#BusinessEvent', '#ProfessionalDevelopment'],
      fest: ['#CollegeFest', '#CampusLife', '#CollegeVibes', '#StudentLife'],
      other: ['#Event', '#Celebration', '#PartyTime', '#Memories'],
    }

    hashtags.push(...(trendingHashtags[data.eventType as keyof typeof trendingHashtags] || trendingHashtags.other))

    // Remove duplicates and empty hashtags
    const uniqueHashtags = [...new Set(hashtags)].filter(Boolean)

    // Store hashtags in database
    await Promise.all(
      uniqueHashtags.map(async (hashtag) => {
        await prisma.hashtag.upsert({
          where: { text: hashtag },
          update: { usageCount: { increment: 1 } },
          create: {
            text: hashtag,
            eventTypeId: eventTypeRecord.id,
            usageCount: 1,
          },
        })
      })
    )

    return NextResponse.json({ hashtags: uniqueHashtags })
  } catch (error) {
    console.error('Error generating hashtags:', error)
    return NextResponse.json(
      { error: 'Failed to generate hashtags' },
      { status: 400 }
    )
  }
} 