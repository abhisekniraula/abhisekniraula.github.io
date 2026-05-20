# Abhisek Niraula Website


## Pages
- `index.html` — Home
- `research.html` — Research projects
- `publications.html` — Published, Submitted, and In Preparation publications
- `presentations.html` — Interactive, image-ready presentations page
- `cv.html` — Education, experience, funding, skills, mentoring
- `honors.html` — Awards, scholarships, professional activities
- `media.html` — Media/gallery page
- `contact.html` — Contact page

## Easiest way to edit
Most content is in:

`assets/js/site-data.js`

Open that file in VS Code or Notepad++ and edit the text inside quotation marks.

## Adding images
Use these folders:
- Profile photo: `assets/profile/profile.jpg`
- Research/project images: `assets/project-images/`
- Presentation images/posters: `assets/presentations/`
- Media/gallery images: `assets/media/`

Then update the image path in `assets/js/site-data.js`.

## Editing inside the browser
Open any page, click **Edit Mode**, edit the JSON preview, and click **Download site-data.js**. Replace the old `assets/js/site-data.js` with the downloaded file.

## Note
The downloadable CV is included at `assets/cv/Abhisek_Niraula_CV.pdf`. To update it later, replace that PDF with a newer PDF using the same filename, or update `profile.cvFile` in `assets/js/site-data.js`.
