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
    title: 'Coding Lecturer Junior High School',
    company: 'SD Negri KedungMungal',
    type: 'Work',
    description:
      'I teach at Kedung Mungal Elementary School as an extracurricular coding teacher. I use Scratch to develop logic in children.',
    date: 'August 2025 - Present',
    url: 'https://maps.app.goo.gl/MwvftcyWuHDVMMFe7',
  },
  {
    title: 'Full Stack Developer Intern',
    company: 'Dinas Perhubungan Kota Surabaya',
    type: 'Work',
    description:
      'At the Dinas Perhubungan Kota Surabaya, I created a website to manage Surabaya\'s bus stops using Laravel. Admins can use CRUD and display bus stop locations based on coordinates.',
    date: 'August 2025 - December 2025',
    url: 'https://halte.dishubsurabaya.info/',
  },
  {
    title: 'Network Engineer',
    company: 'SMK Negeri 1 Mojoanyar',
    type: 'Work',
    description:
      'Conducting network maintenance, installing fiber optic networks at 19 installation points, and regular network maintenance.',
    date: 'January - October 2023',
    url: 'https://www.instagram.com/skanemo_official/',
  },
  {
    title: 'IT Support',
    company: 'SMK Negeri 1 Pungging',
    type: 'Work',
    description:
      'make repairs, design networks, install radio networks, troubleshoot teacher laptops, repair networks on servers and server side.',
    date: 'January 2021 - April 2023',
    url: 'https://www.smkn1pungging.sch.id/',
  },
  
]
