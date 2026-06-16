import { addVolunteer, deleteVolunteer, checkRegistration } from "../models/volunteering.js";

const volunteeringRegistration = async (req, res) => {
    const userId = Number(req.session.user?.user_id);
    const projectId = Number(req.params.id);

    if (!userId || !projectId) {
        req.flash('error', 'Invalid volunteer registration request.');
        return res.redirect('/projects');
    }

    try {
        const isAlreadyRegistered = await checkRegistration(userId, projectId);

        if (isAlreadyRegistered) {
            req.flash('error', 'You are already registered for this project.');
            return res.redirect(`/projects/${projectId}`);
        }

        await addVolunteer(userId, projectId);
        req.flash('success', 'You have successfully volunteered for this project.');
        return res.redirect(`/projects/${projectId}`);
    } catch (error) {
        req.flash('error', 'An error occurred while registering.');
        return res.redirect(`/projects/${projectId}`);
    }
};

const unvolunteerRegistration = async (req, res) => {
    const userId = Number(req.session.user?.user_id);
    const projectId = Number(req.params.id);

    if (!userId || !projectId) {
        req.flash('error', 'Invalid volunteer unsubscribe request.');
        return res.redirect('/projects');
    }

    try {
        await deleteVolunteer(userId, projectId);
        req.flash('success', 'You have been unsubscribed from this project.');
        return res.redirect(`/projects/${projectId}?unsubscribed=true`);
    } catch (error) {
        console.error("Error unsubscribing:", error);
        req.flash('error', 'An error occurred while unsubscribing.');
        return res.redirect(`/projects/${projectId}`);
    }
};

export { volunteeringRegistration, unvolunteerRegistration };
