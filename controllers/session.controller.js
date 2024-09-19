import Session from "../models/session.model.js";

export const createSession = async (req, res) => {
  try {
    const { session: sessions } = req.body;
    console.log(sessions)
    const { id: mentorId } = req.user;

    if (sessions.length < 1) {
      return res.status(400).json({ message: 'Please provide a session' });
    }

    const sessionsArray = sessions.map(({ date, timeSlot }) => {
      if (!date || !timeSlot) {
        throw { status: 400, message: 'Please provide a date and time slot' };
      }
      if (new Date(date) < new Date()) {
        throw { status: 400, message: 'Please provide a valid date' };
      }
      if (timeSlot < '09:00' || timeSlot > '22:00') {
        throw { status: 400, message: 'Please provide a valid time slot between 09:00 to 22:00' };
      }

      return { mentorId, date, timeSlot };
    });

    const result = await Session.insertMany(sessionsArray);
    return res.status(201).json({ message: 'Sessions created successfully', data: result });

  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).json({ message: error.message || 'Internal server error' });
  }
};


export const getSessions = async (req, res) => {
  try {
    const { id: mentorId } = req.user;
    const sessions = await Session.find({ mentorId }); // Projection to return only necessary fields
    return res.status(200).json({ data: sessions });
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message || 'Internal server error' });
  }
}

export const  deleteSession = async(req, res) => {
  try {
    const user = req.user;
    const { sessionId } = req.params;
    const session = await Session.findById(sessionId);
    if(!session){
      return res.status(404).json({ message: 'Session not found' });
    }
    if(session.mentorId !== user.id){
      return res.status(403).json({ message: 'You are not authorized to delete this session' });
    }
    if(session.studentId){
      return res.status(403).json({message: 'You cannot delete this session as a student has already booked it (You can reschedule it)'}); 
    }
    await Session.findByIdAndDelete(sessionId);
    return res.status(200).json({ message: 'Session deleted successfully' });


  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message || 'Internal server error' });
  }
}

export const updateSession = async(req, res) => {

  try {
    const sessionId = req.params.sessionId;
    const session = await Session.findById(sessionId);
    if(!session){
      return res.status(404).json({message: 'Session not found'});
    }
    if(session.mentorId !== req.user.id){
      return res.status(403).json({message: 'You are not authorized to update this session'});
    }

    const {date, timeSlot} = req.body;

    if(!date || !timeSlot){
      return res.status(400).json({message: 'Please provide a date and time slot'});
    }

    if(new Date(date) < new Date()){
      return res.status(400).json({message: 'Please provide a valid date'});
    }

    if(timeSlot < '09:00' || timeSlot > '22:00'){
      return res.status(400).json({message: 'Please provide a valid time slot between 09:00 to 22:00'});
    }

    const updatedSession = await Session.findByIdAndUpdate(sessionId, {date, timeSlot}, {new: true});

    return res.status(200).json({message: 'Session updated successfully', data: updatedSession});

  } catch (error) {
    return res.status(error.status || 500).json({message: error.message || 'Internal server error'});
  }
}


export const bookSession = async(req, res) => {

  try{
    const sessionId = req.params.sessionId;

    const session = await Session.findById(sessionId);
    if(!session){
      return res.status(404).json({message: 'Session not found'});
    }

    if(session.studentId){
      return res.status(403).json({message: 'Session already booked'});
    }

    const updatedSession = await Session.findByIdAndUpdate(sessionId, {studentId: req.user.id}, {new: true});

    return res.status(200).json({mesage:'Session booked successfully', data: updatedSession});

  } catch (error) {
    return res.status(error.status || 500).json({message: error.message || 'Internal server error'});
  }
}