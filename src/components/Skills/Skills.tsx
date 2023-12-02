import  './Skills.css';

export default function Skills() {
  const skills = [
    'HTML',
    '',
    'CSS',
    '',
    'React',
    '',
    'TypeScript',
    '',
    'D3.js',
    '',
    'Ant Design',
    '',
    'Python',
    '',
    'PostgreSQL',
    '',
    'Playwright',
    '',
    'Storybook',
  ];

  return (
    <main className="section">
      <div className="skills">
        <h2 className="title-2">Skills</h2>
        <div className="skills-container">
          {skills.map((skill, index) => (
            <div className={'skill-' + (index % 2)} key={index}>
              {skill}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
