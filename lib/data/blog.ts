/**
 * Blog Data
 * Centralized data for blog posts
 */

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  tags: string[];
  author: string;
  authorRole?: string;
  publishedDate: string;
  readTime: number; // in minutes
  featured?: boolean;
}

export const blogCategories = [
  "All",
  "Educational Articles",
  "Student Stories",
  "Study Tips",
  "Career Guidance",
  "School Updates",
  "Achievements",
  "Parent Resources",
] as const;

export type BlogCategory = (typeof blogCategories)[number];

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "understanding-senior-secondary-education-gambia",
    title: "Understanding Senior Secondary Education in The Gambia",
    excerpt: "A comprehensive guide to the senior secondary education system in The Gambia, including program structures, curriculum, and pathways to higher education.",
    content: `
      <p>Senior secondary education in The Gambia represents a crucial phase in a student's academic journey, preparing them for higher education and professional careers. This comprehensive guide explores the structure, programs, and opportunities available in The Gambia's senior secondary education system.</p>
      
      <h2>Overview of Senior Secondary Education</h2>
      <p>Senior secondary education in The Gambia spans three years (Grade 10 to Grade 12) and follows the completion of Grade 9. This phase is designed to provide students with specialized knowledge and skills in their chosen fields of study.</p>
      
      <h2>Program Structure</h2>
      <p>At Daddy Jobe Comprehensive School, we offer three main programs:</p>
      
      <h3>Science Program</h3>
      <p>The Science program is designed for students interested in pursuing careers in medicine, engineering, technology, and other science-related fields. Core subjects include:</p>
      <ul>
        <li>Mathematics (Core and Elective)</li>
        <li>Physics</li>
        <li>Chemistry</li>
        <li>Biology</li>
        <li>English Language</li>
        <li>Additional subjects based on specialization</li>
      </ul>
      
      <h3>Commerce Program</h3>
      <p>The Commerce program prepares students for careers in business, finance, accounting, and entrepreneurship. Key subjects include:</p>
      <ul>
        <li>Mathematics (Core and Elective)</li>
        <li>Economics</li>
        <li>Commerce</li>
        <li>Accounting</li>
        <li>English Language</li>
        <li>Business Management</li>
      </ul>
      
      <h3>Arts Program</h3>
      <p>The Arts program caters to students interested in humanities, social sciences, languages, and creative fields. Subjects include:</p>
      <ul>
        <li>English Language</li>
        <li>Literature in English</li>
        <li>History</li>
        <li>Geography</li>
        <li>Government/Political Science</li>
        <li>Additional humanities subjects</li>
      </ul>
      
      <h2>The WASSCE Examination</h2>
      <p>The West African Senior Secondary Certificate Examination (WASSCE) is the standardized examination that students take at the end of Grade 12. This examination:</p>
      <ul>
        <li>Is recognized across West Africa</li>
        <li>Provides certification for university admission</li>
        <li>Tests knowledge and skills acquired over three years</li>
        <li>Opens pathways to higher education institutions</li>
      </ul>
      
      <h2>Curriculum and Assessment</h2>
      <p>Our curriculum is aligned with the West African Examinations Council (WAEC) syllabus, ensuring that students receive quality education that prepares them for the WASSCE. Assessment methods include:</p>
      <ul>
        <li>Continuous assessment through class tests and assignments</li>
        <li>Mid-term and end-of-term examinations</li>
        <li>Practical assessments for science subjects</li>
        <li>Project work and presentations</li>
      </ul>
      
      <h2>Pathways After Senior Secondary</h2>
      <p>Upon successful completion of WASSCE, students have several pathways:</p>
      
      <h3>University Education</h3>
      <p>The University of The Gambia and other institutions accept WASSCE results for admission into various degree programs. Requirements vary by program and institution.</p>
      
      <h3>Professional Certifications</h3>
      <p>Many students pursue professional certifications in fields such as accounting, information technology, and healthcare, which may not require a university degree.</p>
      
      <h3>Technical and Vocational Training</h3>
      <p>Technical and vocational institutions offer practical skills training in various trades and professions.</p>
      
      <h2>Support Systems</h2>
      <p>At Daddy Jobe, we provide comprehensive support to ensure student success:</p>
      <ul>
        <li>Experienced and qualified teachers</li>
        <li>Well-equipped laboratories and facilities</li>
        <li>Guidance and counseling services</li>
        <li>Career guidance programs</li>
        <li>Extracurricular activities for holistic development</li>
      </ul>
      
      <h2>Choosing the Right Program</h2>
      <p>When selecting a program, consider:</p>
      <ul>
        <li>Your interests and strengths</li>
        <li>Career aspirations</li>
        <li>Performance in relevant subjects</li>
        <li>University admission requirements for your desired field</li>
      </ul>
      
      <p>Our guidance counselors are available to help students make informed decisions about program selection and career planning.</p>
      
      <p>Understanding the senior secondary education system is the first step toward academic success. At Daddy Jobe Comprehensive School, we're committed to providing quality education that prepares students for their future endeavors.</p>
    `,
    image: "/images/academics/science_lab.png",
    category: "Educational Articles",
    tags: ["Education", "Senior Secondary", "WASSCE", "Curriculum", "Programs"],
    author: "Dr. Omar Manneh",
    authorRole: "Academic Director",
    publishedDate: "2025-01-18",
    readTime: 10,
    featured: true,
  },
  {
    id: "2",
    slug: "role-of-technology-modern-education",
    title: "The Role of Technology in Modern Education",
    excerpt: "Explore how technology is transforming education at Daddy Jobe, from digital libraries to interactive learning tools, and how it prepares students for the digital age.",
    content: `
      <p>Technology has revolutionized the way we teach and learn, creating new opportunities for engagement, collaboration, and personalized learning experiences. At Daddy Jobe Comprehensive School, we embrace technology as a powerful tool to enhance education and prepare students for the digital future.</p>
      
      <h2>Digital Learning Resources</h2>
      <p>Our digital library platform provides students with 24/7 access to:</p>
      <ul>
        <li>Thousands of e-books across all subjects</li>
        <li>Academic journals and research databases</li>
        <li>Educational videos and multimedia content</li>
        <li>Interactive learning modules</li>
        <li>Online practice tests and assessments</li>
      </ul>
      
      <h2>Enhanced Classroom Learning</h2>
      <p>Technology integration in classrooms includes:</p>
      
      <h3>Interactive Whiteboards</h3>
      <p>Our classrooms are equipped with interactive whiteboards that enable teachers to create engaging, multimedia presentations and interactive lessons.</p>
      
      <h3>Computer Laboratories</h3>
      <p>Our ICT laboratory provides students with hands-on experience in:</p>
      <ul>
        <li>Computer applications and software</li>
        <li>Programming and coding</li>
        <li>Digital literacy skills</li>
        <li>Research and information management</li>
      </ul>
      
      <h3>Science Laboratory Technology</h3>
      <p>Modern equipment in our science laboratories allows students to:</p>
      <ul>
        <li>Conduct experiments with digital measurement tools</li>
        <li>Access virtual lab simulations</li>
        <li>Analyze data using computer software</li>
        <li>Document experiments digitally</li>
      </ul>
      
      <h2>Online Learning Platforms</h2>
      <p>We utilize various online platforms to support learning:</p>
      <ul>
        <li>Learning Management Systems for course materials</li>
        <li>Video conferencing for remote learning sessions</li>
        <li>Collaborative tools for group projects</li>
        <li>Assessment platforms for online quizzes and tests</li>
      </ul>
      
      <h2>Benefits for Students</h2>
      <p>Technology in education offers numerous benefits:</p>
      
      <h3>Personalized Learning</h3>
      <p>Technology allows students to learn at their own pace, access resources tailored to their needs, and receive immediate feedback on their progress.</p>
      
      <h3>Accessibility</h3>
      <p>Digital resources are accessible anytime, anywhere, allowing students to study beyond the classroom and accommodate different learning schedules.</p>
      
      <h3>Engagement</h3>
      <p>Interactive multimedia content, gamification, and virtual experiences make learning more engaging and enjoyable.</p>
      
      <h3>Preparation for the Future</h3>
      <p>By using technology in education, students develop digital literacy skills essential for higher education and the modern workforce.</p>
      
      <h2>Challenges and Solutions</h2>
      <p>While technology brings many benefits, we also address challenges:</p>
      
      <h3>Digital Divide</h3>
      <p>We ensure all students have access to technology through school facilities and programs that provide devices to students in need.</p>
      
      <h3>Digital Literacy</h3>
      <p>We provide training for both students and teachers to effectively use educational technology.</p>
      
      <h3>Balancing Screen Time</h3>
      <p>We maintain a balance between digital and traditional learning methods, ensuring students develop both digital and interpersonal skills.</p>
      
      <h2>Future of Technology in Education</h2>
      <p>Looking ahead, we're exploring:</p>
      <ul>
        <li>Artificial intelligence for personalized learning paths</li>
        <li>Virtual and augmented reality for immersive learning experiences</li>
        <li>Blockchain for secure academic records</li>
        <li>Advanced analytics for learning outcomes assessment</li>
      </ul>
      
      <p>At Daddy Jobe, we believe technology should complement, not replace, traditional teaching methods. Our approach combines the best of both worlds to create a comprehensive learning environment that prepares students for success in the digital age.</p>
      
      <p>Technology in education is not just about tools and devices—it's about creating opportunities for deeper learning, broader access, and better outcomes for all students.</p>
    `,
    image: "/images/academics/ict_lab.jpeg",
    category: "Educational Articles",
    tags: ["Technology", "Digital Learning", "Education", "ICT", "Modern Learning"],
    author: "Mr. Alieu Njie",
    authorRole: "ICT Coordinator",
    publishedDate: "2025-01-16",
    readTime: 9,
    featured: true,
  },
  {
    id: "3",
    slug: "excel-in-wassce-examinations",
    title: "10 Proven Strategies to Excel in WASSCE Examinations",
    excerpt: "Discover effective study techniques and preparation strategies that have helped hundreds of students achieve outstanding results in their WASSCE examinations.",
    content: `
      <p>The West African Senior Secondary Certificate Examination (WASSCE) is a crucial milestone in every student's academic journey. With proper preparation and the right strategies, you can achieve excellent results that open doors to higher education and career opportunities.</p>
      
      <h2>1. Create a Comprehensive Study Schedule</h2>
      <p>Planning is the foundation of success. Create a detailed study schedule that allocates time for each subject based on your strengths and weaknesses. Include regular breaks and ensure you maintain a healthy work-life balance.</p>
      
      <h2>2. Master Past Questions</h2>
      <p>Past questions are your best friend when preparing for WASSCE. They help you understand the exam pattern, identify recurring topics, and practice time management. Aim to solve at least 5 years of past questions for each subject.</p>
      
      <h2>3. Focus on Understanding, Not Memorization</h2>
      <p>While memorization has its place, understanding concepts is crucial for long-term success. Focus on grasping the underlying principles, which will help you tackle even unfamiliar questions.</p>
      
      <h2>4. Form Study Groups</h2>
      <p>Collaborative learning can significantly enhance your understanding. Study groups allow you to discuss difficult concepts, share notes, and test each other's knowledge. Choose group members who are committed and focused.</p>
      
      <h2>5. Practice Time Management</h2>
      <p>Time management is critical during examinations. Practice solving questions under timed conditions to improve your speed and accuracy. Learn to allocate time appropriately to different sections.</p>
      
      <h2>6. Take Care of Your Health</h2>
      <p>Your physical and mental health directly impact your performance. Ensure adequate sleep, eat nutritious meals, exercise regularly, and manage stress effectively. A healthy body supports a sharp mind.</p>
      
      <h2>7. Seek Help When Needed</h2>
      <p>Don't hesitate to ask teachers, tutors, or classmates for help when you encounter difficult topics. Daddy Jobe's dedicated teachers are always available to support your learning journey.</p>
      
      <h2>8. Review Regularly</h2>
      <p>Regular revision is essential for retention. Use the spaced repetition technique - review material at increasing intervals to strengthen your memory. Don't cram everything at the last minute.</p>
      
      <h2>9. Stay Updated with Syllabus Changes</h2>
      <p>Ensure you're using the latest syllabus and aware of any changes in the examination format. Our academic department regularly updates students on relevant changes.</p>
      
      <h2>10. Maintain a Positive Mindset</h2>
      <p>Believe in yourself and your abilities. A positive attitude, combined with hard work, goes a long way. Remember that exams are a test of knowledge, not a measure of your worth.</p>
      
      <p>At Daddy Jobe Comprehensive School, we provide comprehensive support to help our students excel in WASSCE. Our experienced teachers, well-equipped facilities, and proven teaching methods create an environment conducive to academic success.</p>
      
      <p>Remember, success in WASSCE is achievable with dedication, proper preparation, and the right support. Start early, stay consistent, and believe in your potential!</p>
    `,
    image: "/images/academics/science_lab.png",
    category: "Study Tips",
    tags: ["WASSCE", "Study Tips", "Examination", "Academic Success"],
    author: "Dr. Omar Manneh",
    authorRole: "Academic Director",
    publishedDate: "2025-01-20",
    readTime: 8,
    featured: true,
  },
  {
    id: "4",
    slug: "success-story-science-graduate",
    title: "From Daddy Jobe to Medical School: A Success Story",
    excerpt: "Meet Fatou Jallow, a Science program graduate who secured a scholarship to study Medicine at the University of The Gambia. Read her inspiring journey and advice for current students.",
    content: `
      <p>Fatou Jallow's journey from Daddy Jobe Comprehensive School to medical school is a testament to hard work, determination, and the quality education provided at our institution.</p>
      
      <h2>The Beginning</h2>
      <p>Fatou joined Daddy Jobe in 2020 as a Grade 10 Science student. Coming from a modest background, she was determined to make the most of her education. Her teachers remember her as a diligent student who never hesitated to ask questions and seek clarification.</p>
      
      <h2>Academic Excellence</h2>
      <p>Throughout her three years at Daddy Jobe, Fatou maintained excellent grades. She particularly excelled in Biology, Chemistry, and Physics - the core subjects for her medical school aspirations. Her dedication to practical work in our science laboratory set her apart.</p>
      
      <h2>Extracurricular Activities</h2>
      <p>Beyond academics, Fatou was an active member of the Science Club and participated in the annual Science Fair. She also served as a peer tutor, helping other students understand complex scientific concepts.</p>
      
      <h2>WASSCE Achievement</h2>
      <p>In 2023, Fatou achieved outstanding results in her WASSCE examinations, scoring A's in all her science subjects. This achievement earned her a full scholarship to study Medicine at the University of The Gambia.</p>
      
      <h2>Advice for Current Students</h2>
      <p>"Never underestimate the power of hard work and consistency," Fatou advises. "Set clear goals, create a study schedule, and stick to it. Don't be afraid to ask for help - your teachers are there to support you."</p>
      
      <p>She also emphasizes the importance of balance: "While academics are important, don't neglect your health and social life. Join clubs, participate in activities, and build lasting friendships."</p>
      
      <h2>Looking Forward</h2>
      <p>Now in her second year of medical school, Fatou continues to excel. She regularly visits Daddy Jobe to mentor current Science students and share her experiences. Her story inspires many students who dream of pursuing careers in healthcare.</p>
      
      <p>At Daddy Jobe, we're proud of Fatou and all our graduates who are making a positive impact in their chosen fields. Her success story demonstrates that with the right support, dedication, and opportunities, anything is possible.</p>
    `,
    image: "/images/gallery/graduation_day.png",
    category: "Student Stories",
    tags: ["Success Story", "Science", "Medical School", "Scholarship"],
    author: "School Administration",
    publishedDate: "2025-01-15",
    readTime: 6,
    featured: true,
  },
  {
    id: "5",
    slug: "career-paths-after-wassce",
    title: "Exploring Career Paths After WASSCE: A Comprehensive Guide",
    excerpt: "Wondering what to do after WASSCE? This comprehensive guide explores various career paths, university programs, and opportunities available to graduates.",
    content: `
      <p>Completing WASSCE is a significant milestone, but it's also the beginning of an important decision-making process. Your choice of career path will shape your future, so it's essential to make informed decisions.</p>
      
      <h2>1. University Education</h2>
      <p>The most traditional path after WASSCE is pursuing higher education at a university. The University of The Gambia offers various programs across multiple faculties:</p>
      <ul>
        <li><strong>Science Programs:</strong> Medicine, Engineering, Pharmacy, Nursing, Agriculture</li>
        <li><strong>Commerce Programs:</strong> Business Administration, Accounting, Economics, Marketing</li>
        <li><strong>Arts Programs:</strong> Law, Journalism, Education, Social Work, Languages</li>
      </ul>
      
      <h2>2. Professional Certifications</h2>
      <p>Many careers don't require a university degree but instead focus on professional certifications:</p>
      <ul>
        <li>Information Technology (IT certifications)</li>
        <li>Accounting (ACCA, ICAG)</li>
        <li>Marketing and Sales</li>
        <li>Hospitality and Tourism</li>
        <li>Technical and Vocational Training</li>
      </ul>
      
      <h2>3. Entrepreneurship</h2>
      <p>If you have a business idea and entrepreneurial spirit, starting your own business is a viable option. Many successful entrepreneurs began their journey right after secondary school.</p>
      
      <h2>4. Skills Development Programs</h2>
      <p>Various organizations offer skills development programs in areas such as:</p>
      <ul>
        <li>Digital skills and technology</li>
        <li>Agriculture and agribusiness</li>
        <li>Creative arts and design</li>
        <li>Healthcare support roles</li>
      </ul>
      
      <h2>Making the Right Choice</h2>
      <p>When choosing a career path, consider:</p>
      <ul>
        <li>Your interests and passions</li>
        <li>Your strengths and skills</li>
        <li>Market demand and opportunities</li>
        <li>Financial considerations</li>
        <li>Long-term career prospects</li>
      </ul>
      
      <h2>Guidance and Support</h2>
      <p>At Daddy Jobe, our Guidance and Counseling department provides comprehensive career counseling to help students make informed decisions. We organize career fairs, invite professionals to speak, and provide resources on various career paths.</p>
      
      <p>Remember, there's no single "right" path. Success comes in many forms, and the most important thing is to choose a path that aligns with your interests, values, and goals.</p>
    `,
    image: "/images/gallery/science_fair_day.png",
    category: "Career Guidance",
    tags: ["Career", "WASSCE", "University", "Future Planning"],
    author: "Mr. Lamin Sarr",
    authorRole: "Guidance Counselor",
    publishedDate: "2025-01-12",
    readTime: 7,
  },
  {
    id: "6",
    slug: "effective-time-management-students",
    title: "Mastering Time Management: Essential Skills for Student Success",
    excerpt: "Learn how to effectively manage your time, balance academics with extracurricular activities, and maintain a healthy lifestyle as a student.",
    content: `
      <p>Time management is one of the most critical skills for academic success. As a student, you juggle classes, homework, extracurricular activities, and personal time. Effective time management can make the difference between stress and success.</p>
      
      <h2>Understanding Your Time</h2>
      <p>Start by tracking how you currently spend your time for a week. This will help you identify time wasters and areas where you can be more efficient.</p>
      
      <h2>Creating a Study Schedule</h2>
      <p>A well-planned schedule is your roadmap to success:</p>
      <ul>
        <li>Allocate specific times for each subject</li>
        <li>Prioritize difficult subjects during your peak hours</li>
        <li>Include breaks every 45-60 minutes</li>
        <li>Set aside time for review and revision</li>
      </ul>
      
      <h2>The Pomodoro Technique</h2>
      <p>This proven technique involves:</p>
      <ol>
        <li>Study for 25 minutes (one Pomodoro)</li>
        <li>Take a 5-minute break</li>
        <li>After 4 Pomodoros, take a longer 15-30 minute break</li>
      </ol>
      <p>This method helps maintain focus and prevents burnout.</p>
      
      <h2>Setting Priorities</h2>
      <p>Not all tasks are equally important. Use the Eisenhower Matrix:</p>
      <ul>
        <li><strong>Urgent and Important:</strong> Do these first</li>
        <li><strong>Important but Not Urgent:</strong> Schedule these</li>
        <li><strong>Urgent but Not Important:</strong> Delegate if possible</li>
        <li><strong>Neither Urgent nor Important:</strong> Eliminate these</li>
      </ul>
      
      <h2>Avoiding Procrastination</h2>
      <p>Procrastination is a time thief. Combat it by:</p>
      <ul>
        <li>Breaking large tasks into smaller, manageable steps</li>
        <li>Starting with the hardest task first</li>
        <li>Removing distractions (phone, social media)</li>
        <li>Rewarding yourself for completing tasks</li>
      </ul>
      
      <h2>Balancing Academics and Activities</h2>
      <p>While academics are important, extracurricular activities contribute to holistic development. Balance both by:</p>
      <ul>
        <li>Allocating specific days for activities</li>
        <li>Not sacrificing sleep for either</li>
        <li>Learning to say no when necessary</li>
        <li>Choosing activities that align with your interests</li>
      </ul>
      
      <h2>Time Management Tools</h2>
      <p>Consider using:</p>
      <ul>
        <li>Physical planners or digital calendars</li>
        <li>To-do list apps</li>
        <li>Time tracking apps</li>
        <li>Focus apps that block distractions</li>
      </ul>
      
      <h2>Maintaining Flexibility</h2>
      <p>While structure is important, be flexible. Life happens, and sometimes you need to adjust your schedule. The key is to get back on track quickly.</p>
      
      <p>Remember, effective time management isn't about working all the time—it's about working smart and making time for what truly matters, including rest and recreation.</p>
    `,
    image: "/images/academics/ict_lab.jpeg",
    category: "Study Tips",
    tags: ["Time Management", "Study Tips", "Productivity", "Student Life"],
    author: "Mrs. Fatou Touray",
    authorRole: "Academic Coordinator",
    publishedDate: "2025-01-10",
    readTime: 6,
  },
  {
    id: "7",
    slug: "new-library-digital-platform",
    title: "Introducing Our New Digital Library Platform",
    excerpt: "We're excited to announce the launch of our enhanced digital library platform, providing students with 24/7 access to e-books, research databases, and learning resources.",
    content: `
      <p>We're thrilled to announce the launch of our enhanced Digital Library Platform, a significant upgrade to our library services that brings learning resources directly to your fingertips.</p>
      
      <h2>What's New?</h2>
      <p>Our new platform offers:</p>
      <ul>
        <li><strong>24/7 Access:</strong> Access resources anytime, anywhere</li>
        <li><strong>E-Book Collection:</strong> Thousands of e-books across all subjects</li>
        <li><strong>Research Databases:</strong> Access to academic journals and research papers</li>
        <li><strong>Multimedia Resources:</strong> Educational videos, documentaries, and interactive content</li>
        <li><strong>Mobile App:</strong> Download our app for on-the-go access</li>
      </ul>
      
      <h2>How to Access</h2>
      <p>All students receive login credentials. Simply visit our library portal and log in with your student ID and password. The platform is also accessible from our school website.</p>
      
      <h2>Features</h2>
      <p>Key features include:</p>
      <ul>
        <li>Advanced search functionality</li>
        <li>Personal reading lists and bookmarks</li>
        <li>Note-taking and annotation tools</li>
        <li>Citation generators for research papers</li>
        <li>Progress tracking for reading goals</li>
      </ul>
      
      <h2>Training Sessions</h2>
      <p>Our library staff will conduct training sessions to help students maximize the platform's features. Sessions are scheduled throughout the term.</p>
      
      <p>This digital transformation represents our commitment to providing students with the best learning resources and preparing them for the digital age.</p>
    `,
    image: "/images/library/library-interior.webp",
    category: "School Updates",
    tags: ["Library", "Technology", "Digital Resources", "Announcement"],
    author: "Library Department",
    publishedDate: "2025-01-08",
    readTime: 4,
  },
  {
    id: "8",
    slug: "supporting-childs-education",
    title: "How Parents Can Support Their Child's Education: A Guide",
    excerpt: "Practical tips and strategies for parents to actively support their children's academic journey and overall development at Daddy Jobe Comprehensive School.",
    content: `
      <p>Parental involvement is one of the most significant factors in a child's academic success. At Daddy Jobe, we believe in building strong partnerships with parents to support student achievement.</p>
      
      <h2>1. Establish a Learning Environment at Home</h2>
      <p>Create a dedicated, quiet space for studying with minimal distractions. Ensure your child has access to necessary materials and a regular schedule for homework and study time.</p>
      
      <h2>2. Communicate Regularly with Teachers</h2>
      <p>Maintain open communication with your child's teachers. Attend parent-teacher conferences, respond to communication promptly, and don't hesitate to reach out when you have concerns.</p>
      
      <h2>3. Monitor Academic Progress</h2>
      <p>Stay informed about your child's academic performance. Review report cards, check assignments, and discuss progress regularly. Celebrate achievements and address challenges early.</p>
      
      <h2>4. Encourage Reading</h2>
      <p>Foster a love for reading by providing books, visiting libraries, and reading together. Reading enhances vocabulary, comprehension, and critical thinking skills.</p>
      
      <h2>5. Support Healthy Habits</h2>
      <p>Ensure your child gets adequate sleep, eats nutritious meals, and exercises regularly. Physical health directly impacts academic performance and mental well-being.</p>
      
      <h2>6. Set Realistic Expectations</h2>
      <p>While it's important to encourage excellence, set realistic expectations based on your child's abilities. Focus on effort and improvement rather than just grades.</p>
      
      <h2>7. Attend School Events</h2>
      <p>Participate in school events, parent meetings, and activities. Your presence shows your child that education is important and valued.</p>
      
      <h2>8. Teach Time Management</h2>
      <p>Help your child develop time management skills by creating schedules, setting priorities, and teaching them to balance academics with other activities.</p>
      
      <h2>9. Provide Emotional Support</h2>
      <p>Be there for your child emotionally. Listen to their concerns, provide encouragement during difficult times, and celebrate their successes, no matter how small.</p>
      
      <h2>10. Stay Informed About School Policies</h2>
      <p>Familiarize yourself with school policies, curriculum, and expectations. This helps you guide and support your child effectively.</p>
      
      <p>At Daddy Jobe, we value the partnership with parents and are committed to working together to ensure every student reaches their full potential.</p>
    `,
    image: "/images/about/morning_assembly.png",
    category: "Parent Resources",
    tags: ["Parenting", "Education", "Support", "Family"],
    author: "School Administration",
    publishedDate: "2025-01-05",
    readTime: 7,
  },
  {
    id: "9",
    slug: "science-fair-2025-winners",
    title: "Science Fair 2025: Celebrating Innovation and Excellence",
    excerpt: "Read about the outstanding projects and winners from our annual Science Fair, showcasing the innovative thinking and scientific skills of our students.",
    content: `
      <p>Our annual Science Fair once again demonstrated the exceptional talent, creativity, and scientific thinking of our students. This year's event featured over 50 projects across various scientific disciplines.</p>
      
      <h2>Overall Winners</h2>
      <p><strong>First Place:</strong> Sustainable Water Purification System by Grade 12 Science students</p>
      <p>This innovative project addressed water scarcity by developing an affordable, eco-friendly water purification system using locally available materials.</p>
      
      <p><strong>Second Place:</strong> Solar-Powered Mobile Charging Station by Grade 11 Science students</p>
      <p>A practical solution to electricity challenges, this project demonstrated practical application of renewable energy principles.</p>
      
      <p><strong>Third Place:</strong> Medicinal Plant Research by Grade 10 Science students</p>
      <p>An impressive study of local medicinal plants, their properties, and potential applications in modern medicine.</p>
      
      <h2>Special Categories</h2>
      <p>Winners were also recognized in special categories:</p>
      <ul>
        <li>Most Innovative Project</li>
        <li>Best Presentation</li>
        <li>Environmental Impact Award</li>
        <li>Community Relevance Award</li>
      </ul>
      
      <h2>Judges' Comments</h2>
      <p>Our panel of judges, including university professors and industry professionals, praised the high quality of projects and the students' understanding of scientific principles.</p>
      
      <p>Congratulations to all participants for their hard work, creativity, and dedication to scientific inquiry!</p>
    `,
    image: "/images/gallery/science_fair_day.png",
    category: "Achievements",
    tags: ["Science Fair", "Achievement", "Innovation", "Student Success"],
    author: "Science Department",
    publishedDate: "2025-01-03",
    readTime: 5,
  },
  {
    id: "10",
    slug: "effective-note-taking-techniques",
    title: "Effective Note-Taking Techniques for Better Learning",
    excerpt: "Master the art of note-taking with proven techniques that enhance comprehension, retention, and review efficiency.",
    content: `
      <p>Effective note-taking is a skill that significantly impacts academic performance. Good notes serve as valuable study resources and help you understand and retain information better.</p>
      
      <h2>The Cornell Method</h2>
      <p>This method divides your page into three sections:</p>
      <ul>
        <li><strong>Notes:</strong> Main content area for class notes</li>
        <li><strong>Cues:</strong> Left margin for keywords and questions</li>
        <li><strong>Summary:</strong> Bottom section for key points</li>
      </ul>
      <p>This structure makes review easier and more effective.</p>
      
      <h2>Mind Mapping</h2>
      <p>Perfect for visual learners, mind maps help you see relationships between concepts. Start with a central topic and branch out with related ideas.</p>
      
      <h2>The Outline Method</h2>
      <p>Organize information hierarchically using headings and subheadings. This works well for structured lectures and textbook reading.</p>
      
      <h2>Digital vs. Handwritten Notes</h2>
      <p>Research suggests handwriting may improve retention, but digital notes offer advantages like searchability and easy organization. Choose what works best for you.</p>
      
      <h2>Active Listening</h2>
      <p>Effective note-taking requires active listening. Focus on main ideas, key concepts, and examples rather than trying to write everything verbatim.</p>
      
      <h2>Review and Revise</h2>
      <p>Review your notes within 24 hours to reinforce learning. Revise and expand on unclear points while the information is still fresh in your mind.</p>
      
      <p>Experiment with different techniques to find what works best for you. The best note-taking method is the one you'll consistently use and review.</p>
    `,
    image: "/images/academics/commerce_class.png",
    category: "Study Tips",
    tags: ["Note-Taking", "Study Tips", "Learning", "Study Skills"],
    author: "Mr. Alieu Njie",
    authorRole: "Academic Advisor",
    publishedDate: "2024-12-28",
    readTime: 5,
  },
];

// Helper functions
export function getAllPosts(): BlogPost[] {
  return blogPosts.sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getPostsByCategory(category: string): BlogPost[] {
  if (category === "All") return getAllPosts();
  return getAllPosts().filter((post) => post.category === category);
}

export function searchPosts(query: string): BlogPost[] {
  const searchLower = query.toLowerCase();
  return getAllPosts().filter(
    (post) =>
      post.title.toLowerCase().includes(searchLower) ||
      post.excerpt.toLowerCase().includes(searchLower) ||
      post.content.toLowerCase().includes(searchLower) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchLower))
  );
}

export function getFeaturedPosts(): BlogPost[] {
  return getAllPosts().filter((post) => post.featured).slice(0, 3);
}

export function getRelatedPosts(currentPost: BlogPost, limit: number = 3): BlogPost[] {
  return getAllPosts()
    .filter((post) => post.id !== currentPost.id && (post.category === currentPost.category || post.tags.some((tag) => currentPost.tags.includes(tag))))
    .slice(0, limit);
}

