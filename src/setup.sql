-- ========================
-- Organization Table
-- ========================
CREATE TABLE IF NOT EXISTS organization (
	organization_id SERIAL PRIMARY KEY,
	name VARCHAR(150) NOT NULL,
	description TEXT NOT NULL,
	contact_email VARCHAR(255) NOT NULL,
	logo_filename  VARCHAR(255) NOT NULL
);


-- ============
-- Insert data
-- ============

INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
(
    'BrightFuture Builders',
    'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
    'info@brightfuturebuilders.org',
    'brightfuture-logo.png'
);

INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
(
    'GreenHarvest Growers',
    'An urban farming collective promoting food sustainability and education in local neighborhoods.',
    'contact@greenharvest.org',
    'greenharvest-logo.png'
);

INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
(
    'UnityServe Volunteers',
    'A volunteer coordination group supporting local charities and service initiatives.',
    'hello@unityserve.org',
    'unityserve-logo.png'
);


CREATE TABLE IF NOT EXISTS service_projects (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    title VARCHAR(250) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(250) NOT NULL,
    project_date DATE NOT NULL,
    
    FOREIGN KEY (organization_id)
        REFERENCES organization(organization_id)
        ON DELETE CASCADE
);


INSERT INTO service_projects (organization_id, title, description, location, project_date)
VALUES
(1, 'Community Housing Repair', 'Repairing homes for low-income families', 'Porto', '2025-06-10'),
(1, 'School Renovation Project', 'Renovating local public schools', 'Lisboa', '2025-07-05'),
(1, 'Eco Housing Initiative', 'Building sustainable housing units', 'Braga', '2025-08-12'),
(1, 'Bridge Restoration', 'Restoring old pedestrian bridges', 'Coimbra', '2025-09-01'),
(1, 'Urban Infrastructure Upgrade', 'Improving sidewalks and streets', 'Faro', '2025-10-15'),

(2, 'Urban Garden Expansion', 'Expanding community gardens', 'Lisboa', '2025-06-20'),
(2, 'School Farming Program', 'Teaching kids sustainable farming', 'Setúbal', '2025-07-18'),
(2, 'Hydroponics Workshop', 'Training locals in hydroponics', 'Porto', '2025-08-22'),
(2, 'Food Sustainability Fair', 'Community awareness event', 'Braga', '2025-09-10'),
(2, 'Rooftop Gardens Project', 'Creating rooftop farms in cities', 'Coimbra', '2025-10-05'),

(3, 'Food Drive Initiative', 'Collecting food for families in need', 'Lisboa', '2025-06-25'),
(3, 'Beach Cleanup Campaign', 'Cleaning coastal areas', 'Algarve', '2025-07-12'),
(3, 'Elderly Support Program', 'Helping elderly citizens', 'Porto', '2025-08-08'),
(3, 'Homeless Shelter Support', 'Volunteering at shelters', 'Coimbra', '2025-09-20'),
(3, 'Community Volunteer Day', 'City-wide volunteer activities', 'Braga', '2025-10-18');


-- =====================
-- Create Categories table
-- ======================

CREATE TABLE IF NOT EXISTS categories(
	category_id SERIAL PRIMARY KEY,
	name VARCHAR(100) NOT NULL
);


-- ==========================
-- Create Relational Category Table
-- ==========================
CREATE TABLE IF NOT EXISTS project_categories(
	category_id INT NOT NULL,
	project_id INT NOT NULL,
	PRIMARY KEY (category_id, project_id),

	FOREIGN KEY (category_id)
		REFERENCES categories(category_id)
		ON DELETE CASCADE,

	FOREIGN KEY (project_id)
		REFERENCES service_projects(project_id)
		ON DELETE CASCADE
	
);

INSERT INTO categories (name) VALUES
('Housing & Construction'),
('Urban Farming & Sustainability'),
('Community Support & Volunteering');

INSERT INTO project_categories (category_id, project_id) VALUES
(1, 1), -- Community Housing Repair
(1, 2), -- School Renovation Project
(1, 3), -- Eco Housing Initiative
(1, 4), -- Bridge Restoration
(1, 5), -- Urban Infrastructure Upgrade

(2, 6), -- Urban Garden Expansion
(2, 7), -- School Farming Program
(2, 8), -- Hydroponics Workshop
(2, 9), -- Food Sustainability Fair
(2, 10), -- Rooftop Gardens Project

(3, 11), -- Food Drive Initiative
(3, 12), -- Beach Cleanup Campaign
(3, 13), -- Elderly Support Program
(3, 14), -- Homeless Shelter Support
(3, 15); -- Community Volunteer Day


INSERT INTO categories (name) VALUES 
('Sports'),
('Technology'),
('Education');


SELECT NOW();

INSERT INTO service_projects (
    organization_id,
    title,
    description,
    location,
    project_date
)
VALUES
(
    1,
    'Community Food Drive',
    'Collect and distribute food to families experiencing food insecurity.',
    'Salt Lake City, UT',
    '2026-07-15'
),
(
    1,
    'School Supply Donation Event',
    'Gather and distribute school supplies to local students.',
    'Provo, UT',
    '2026-08-10'
),
(
    2,
    'Neighborhood Park Cleanup',
    'Volunteers work together to clean and improve a local park.',
    'Ogden, UT',
    '2026-07-22'
),
(
    2,
    'Senior Center Support Day',
    'Assist senior citizens with activities and facility maintenance.',
    'Logan, UT',
    '2026-09-05'
),
(
    3,
    'Youth Mentorship Workshop',
    'Provide educational and leadership mentoring for youth.',
    'Idaho Falls, ID',
    '2026-08-20'
),
(
    3,
    'Holiday Care Package Assembly',
    'Prepare care packages for families and individuals in need.',
    'Boise, ID',
    '2026-12-01'
);


-- ========================
-- Roles
-- ========================

CREATE TABLE IF NOT EXISTS roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    role_description TEXT
);

INSERT INTO roles (role_name, role_description)
VALUES
(
    'user',
    'Standard user with basic access'
),
(
    'admin',
    'Administrator with full system access'
);

--=================
-- USER
--=================

CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(role_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

);

CREATE TABLE IF NOT EXISTS volunteering (
	volunteer_id SERIAL PRIMARY KEY,
	user_id INT,
	project_id INT,
	created_at TIMESTAMP DEFAULT NOW(),
	FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
	FOREIGN KEY (project_id) REFERENCES service_projects(project_id) ON DELETE CASCADE,
	UNIQUE(user_id,project_id)
);