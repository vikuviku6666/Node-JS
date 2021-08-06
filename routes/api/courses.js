const Joi = require('joi');
const uuid = require('uuid');
const express = require('express');
const router = express.Router();
const courses = require('../../Courses');

//GET /courses

router.get('/hi', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

router.get('/', (req, res) => {
	res.send(courses);
});

router.get('/:id', (req, res) => {
	const course = courses.find((course) => course.id === parseInt(req.params.id));
	if (!course) return res.status(404).json({ msg: `Course with id ${req.params.id} not found` });
	res.send(course);
});

// Create POST /courses

router.post('/', (req, res) => {
	const { error } = validateCourse(req.body);
	if (error) return res.status(400).send(error.details[0].message);
	const course = {
		//id: courses[courses.length - 1].id + 1,
		id: uuid.v4(),
		name: req.body.name,
		description: req.body.description,
		email: req.body.email,
		status: 'active',
	};
	courses.push(course);
	res.json(course);
	//res.redirect('/');
});

// PUT or update /courses/:id

router.put('/:id', (req, res) => {
	// Lookup the course
	// If it doesn't exist, return a 404

	const course = courses.find((course) => course.id === parseInt(req.params.id));
	if (!course) return res.status(404).send('Course not found');

	// Validate the course
	// If it's invalid, return a 400 -Bad request
	if (course) {
		const { error } = validateCourse(req.body);
		if (error) return res.status(400).send(error.details[0].message);
		const updCo = req.body;
		courses.forEach((c) => {
			if (c.id === parseInt(req.params.id)) {
				course.name = updCo.name ? updCo.name : course.name;
				course.description = updCo.description ? updCo.description : course.description;
				course.email = updCo.email ? updCo.email : course.email;
				res.json({ msg: 'Course Updated', course: course });
			}
		});
	}
});
// DELETE /courses/:id

router.delete('/:id', (req, res) => {
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

function validateCourse(course) {
	const schema = Joi.object({
		name: Joi.string().min(3),
		description: Joi.string().min(3),
		email: Joi.string().email(),
	});
	return schema.validate(course);
}

module.exports = router;
