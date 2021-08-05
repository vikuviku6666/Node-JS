const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const courses = [
	{
		id: 1,
		name: 'JavaScript',
		description:
			'JavaScript is a high-level, dynamic, untyped, and interpreted programming language.',
	},
	{
		id: 2,
		name: 'Node.js',
		description: "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine.",
	},
];

// GET /courses

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.get('/api/courses', (req, res) => {
	res.send(courses);
});

// POST /courses

app.post('/api/courses', (req, res) => {
	const { error } = validateCourse(req.body);

	if (error) return res.status(400).send(error.details[0].message);
	
	const course = {
		id: courses[courses.length - 1].id + 1,
		name: req.body.name,
	};
	courses.push(course);
	res.send(course);
});

// PUT /courses/:id

app.put('/api/courses/:id', (req, res) => {
	// Lookup the course
	// If it doesn't exist, return a 404

	const course = courses.find((course) => course.id === parseInt(req.params.id));
  if (!course) return res.status(404).send('Course not found');
  

	// Validate the course
	// If it's invalid, return a 400 -Bad request
	const { error } = validateCourse(req.body);
	if (error) return res.status(400).send(error.details[0].message);
		

	// Update the course
	course.name = req.body.name;
	// Return the updated course
	res.send(course);
});

// DELETE /courses/:id

app.delete('/api/courses/:id', (req, res) => {

  // Lookup the course
  // If it doesn't exist, return a 404
  const course = courses.find((course) => course.id === parseInt(req.params.id));
  if (!course) return res.status(404).send('Course not found');

  //Delete the course
  const index = courses.indexOf(course);
  courses.splice(index, 1);
  //Return the same course
  res.send(course);
});



app.get('/api/courses/:id', (req, res) => {
	const course = courses.find((course) => course.id === parseInt(req.params.id));
	if (!course) return res.status(404).send('Course not found');
	res.send(course);
});

function validateCourse(course) {
	const schema = Joi.object({
		name: Joi.string().min(3).required(),
	});
	return schema.validate(course);
}

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Example app listening on  ${port}!`));
