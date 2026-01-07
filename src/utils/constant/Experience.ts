import { url } from 'inspector'
import { title } from 'process'

interface IExperience {
  title: string
  company: string
  type: string
  description: string
  date: string
}
export const experience = [
  {
    title: 'Full Stack Developer Intern',
    company: 'Dinas Perhubungan Kota Surabaya',
    type: 'Internship',
    description:
      'At the Dinas Perhubungan Kota Surabaya, I created a website to manage Surabaya\'s bus stops using Laravel. Admins can use CRUD and display bus stop locations based on coordinates.',
    date: 'August 2025 - December 2025',
    url: 'https://halte.dishubsurabaya.info/',
  },
  {
    title: 'Mobile Developer Cohort',
    company: 'Bangkit Academy',
    type: 'Education',
    description:
      'The Mobile Developer Cohort at Bangkit Academy is an intensive program from February to July 2024, focused on Android development and integrating machine learning into Android apps. Participants will work on hands-on projects and receive expert mentorship, culminating in a robust portfolio of Android applications.',
    date: 'Febuary - July 2024',
    url: 'https://grow.google/intl/id_id/bangkit?tab=machine-learning',
  },
  {
    title: 'Lab Assistant',
    company: 'STMIK Widya Cipta Dharma',
    type: 'Work',
    description:
      'support the operation and success of practicum activities and setting up the necessary equipment and softwareensuring laboratory safety and order and providing assistance to students during practical sessions.',
    date: 'April 2023 - April 2024',
    url: 'https://www.wicida.ac.id/',
  },
  
]
