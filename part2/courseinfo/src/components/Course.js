const Header = ({ course }) => <h1>{course}</h1>

const CourseContent = ({part}) => {
  return (
    <h4>
      {part.name} {part.exercises}
    </h4>
  )
}

const Course = ({course}) => {
  const total = course.parts.reduce((s, p) => {
    if(s.id === 1) return s.exercises + p.exercises
    else return s + p.exercises
  })
  return (
    <div>
      <Header course={course.name} />
      {course.parts.map(part => 
        <CourseContent key={part.id} part={part} />
      )}
      <h4>total of {total} exercises</h4>
    </div>
  )
}

export default Course