export interface WebsiteSettings {
    admitto: AdmittoSettings;
    currentEdition: EditionSettings;
}

interface AdmittoSettings {
    baseUrl: string;
    teamSlug: string;
    eventSlug: string;
    mainConferenceTicketSlug: string;
}

interface EditionSettings {
    slug: string;
    description: string;
    conferenceDate: Date;
    speakers: SpeakerSettings;
    cfp: CfpSettings;
    schedule: ScheduleSettings;
    registration: RegistrationSettings;
    organizers: Organizer[];
    sponsors: SponsorSettings;
    codeOfConduct: CodeOfConductSettings;

    isCurrentlyTakingPlace: () => boolean;
}

interface RegistrationSettings {
    opensAt: Date;
    closesAt: Date;
    enabled: boolean;

    isOpen: () => boolean;
}

interface ScheduleSettings {
    announced: boolean;
    finalized: boolean;
    timeZone: string;
}

interface SpeakerSettings {
    announced: boolean;
}

interface CfpSettings {
    opensAt: Date;
    closesAt: Date;
    enabled: boolean;
    sessionizeUrl: string;

    isOpen: () => boolean;
}

interface SponsorSettings {
    gold: Sponsor[];
    community: Sponsor[];
}

interface Sponsor {
    name: string;
    websiteUrl: string;
    imageUrl: string;
}

interface Organizer {
    name: string;
    company: string;
    imageUrl: string;
}

interface CodeOfConductSettings {
    contacts: CodeOfConductContactSettings[];
}

interface CodeOfConductContactSettings {
    name: string;
    phoneNumber: string;
}

export const websiteSettings: WebsiteSettings = {
    admitto: {
        baseUrl: process.env.NEXT_PUBLIC_ADMITTO_URL || "https://admitto.sandermolenkamp.com",
        // TODO Confirm these production Admitto slugs for Azure Fest and set env vars in deployment.
        teamSlug: process.env.NEXT_PUBLIC_ADMITTO_TEAM_SLUG || "azure-fest",
        eventSlug: process.env.NEXT_PUBLIC_ADMITTO_EVENT_SLUG || "azure-fest-2026",
        mainConferenceTicketSlug: process.env.NEXT_PUBLIC_ADMITTO_MAIN_TICKET_SLUG || "conference"
    },
    currentEdition: {
        slug: "2026",
        description: "Azure Fest 2026",
        conferenceDate: new Date("2026-09-23T00:00:00+02:00"),
        speakers: {
            announced: false
        },
        cfp: {
            opensAt: new Date("2026-02-23T12:00:00+02:00"),
            closesAt: new Date("2026-06-05T23:59:59+02:00"),
            enabled: true,
            sessionizeUrl: "https://sessionize.com/azure-fest-2026/",
            isOpen: function () {
                const now = new Date();
                return this.enabled && now >= this.opensAt && now <= this.closesAt;
            }
        },
        schedule: {
            announced: false,
            finalized: false,
            timeZone: "+02:00"
        },
        registration: {
            opensAt: new Date("2026-07-08T00:00:00+02:00"),
            closesAt: new Date("2026-09-22T23:59:59+02:00"),
            enabled: false,
            isOpen: function () {
                const now = new Date();
                return this.enabled && now >= this.opensAt && now <= this.closesAt;
            }
        },
        organizers: [
            { name: "Pascal Naber", company: "Tech Driven", imageUrl: "img/organizers/pascal.jpg" },
            { name: "Jan de Vries", company: "Zure", imageUrl: "img/organizers/jan.jpg" },
            { name: "Eva Munscher", company: "Sopra Steria", imageUrl: "img/organizers/eva.jpg" },
            { name: "Sander Molenkamp", company: "Info Support", imageUrl: "img/organizers/sander.jpg" },
            { name: "Jurgen Allewijn", company: "Yuma", imageUrl: "img/organizers/jurgen.jpg" },
            { name: "Marco Mansi", company: "SoftAware B.V.", imageUrl: "img/organizers/marco.jpg" }
        ],
        sponsors: {
            gold: [
                { name: "Betabit", websiteUrl: "https://www.betabit.nl", imageUrl: "img/sponsors/betabit.png" },
                { name: "Brainstack", websiteUrl: "https://www.brainstack.nl", imageUrl: "img/sponsors/brainstack.png" },
                { name: "Cloud Republic", websiteUrl: "https://cloudrepublic.nl", imageUrl: "img/sponsors/cloudrepublic.png" },
                { name: "Dutchworkz", websiteUrl: "https://dutchworkz.nl", imageUrl: "img/sponsors/dutchworkz.png" },
                { name: "Info Support", websiteUrl: "https://www.infosupport.com", imageUrl: "img/sponsors/info-support.png" },
                { name: "Luminis", websiteUrl: "https://luminis.eu", imageUrl: "img/sponsors/Luminis.png" },
                { name: "Microsoft", websiteUrl: "https://www.microsoft.com", imageUrl: "img/sponsors/microsoft.png" },
                { name: "Sopra Steria", websiteUrl: "https://www.soprasteria.nl", imageUrl: "img/sponsors/sopra-steria.png" },
                { name: "Cegeka", websiteUrl: "https://www.cegeka.nl", imageUrl: "img/sponsors/cegeka.png" },
                { name: "The Factory", websiteUrl: "https://www.thefactory.nl", imageUrl: "img/sponsors/the-factory.png" }
            ],
            community: [
                { name: "Dutch Azure Meetup", websiteUrl: "https://dutchazuremeetup.nl", imageUrl: "img/sponsors/dutchazuremeetup.png" },
                { name: "Dutch Women in Tech", websiteUrl: "https://www.dwit.work", imageUrl: "img/sponsors/dutch-women-in-tech.png" },
                { name: "SDN", websiteUrl: "https://sdn.nl", imageUrl: "img/sponsors/SDN_rgb.png" },
                { name: "SDN Cast", websiteUrl: "https://www.sdncast.nl", imageUrl: "img/sponsors/SDN_cast.png" },
                { name: "Azure Heroes", websiteUrl: "https://www.azug.nl", imageUrl: "img/sponsors/azure-heroes.png" }
            ]
        },
        isCurrentlyTakingPlace: function () {
            const options = { timeZone: "Europe/Amsterdam" };
            const today = new Date().toLocaleDateString("nl-NL", options);
            return today === this.conferenceDate.toLocaleDateString("nl-NL", options);
        },
        codeOfConduct: {
            contacts: []
        }
    }
};
