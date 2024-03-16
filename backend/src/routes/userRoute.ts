import { Router } from 'express'
import { UserLocationController } from '../controllers/user/userLocation'
import { UserVolunteerController } from '../controllers/user/userVolunteer'
import { UserEducationController } from '../controllers/user/userEducation'
import { UserAwardController } from '../controllers/user/userAward'
import { UserCertificateController } from '../controllers/user/userCertificate'
import { UserPublicationController } from '../controllers/user/userPublication'
import { UserLanguageController } from '../controllers/user/userLanguage'
import { UserInterestController } from '../controllers/user/userInterest'
import { UserReferenceController } from '../controllers/user/userReference'

import { UserWorkController } from '../controllers/user/userWork'
import { UserSkillController } from '../controllers/user/userSkill'
import { UserSectionController, getUserSectionDataAsync } from '../controllers/user/userSection'
import { UserResourceController } from '../controllers/user/userResource'
import { UserProjectController } from '../controllers/user/userProject'
import { UserProfileController } from '../controllers/user/userProfile'
import { UserBasicController } from '../controllers/user/userBasic'
import { getUserResumeAsync } from '../controllers/user/userResume'

import { auth } from '../middlewares/auth'

const router = Router()

const controllers = [
  { route: 'work', controller: new UserWorkController(), resume: true },
  { route: 'skill', controller: new UserSkillController(), resume: true },
  { route: 'project', controller: new UserProjectController(), resume: true },
  { route: 'profile', controller: new UserProfileController(), resume: true },
  { route: 'basic', controller: new UserBasicController(), resume: true },
  { route: 'section', controller: new UserSectionController(), resume: false },
  { route: 'resource', controller: new UserResourceController(), resume: true },
  { route: 'location', controller: new UserLocationController(), resume: true },
  { route: 'volunteer', controller: new UserVolunteerController(), resume: true },
  { route: 'education', controller: new UserEducationController(), resume: true },
  { route: 'award', controller: new UserAwardController(), resume: true },
  { route: 'certificate', controller: new UserCertificateController(), resume: true },
  { route: 'publication', controller: new UserPublicationController(), resume: true },
  { route: 'language', controller: new UserLanguageController(), resume: true },
  { route: 'interest', controller: new UserInterestController(), resume: true },
  { route: 'reference', controller: new UserReferenceController(), resume: true },
]

controllers.forEach(c => {
  const { route, controller, resume } = c
  router.get(`/:userId/${route}`, auth, controller.getUserSectionAsync.bind(controller))
  router.post(`/:userId/${route}`, auth, controller.createUserSection.bind(controller))
  router.put(`/:userId/${route}/:id`, auth, controller.updateUserSection.bind(controller))
  router.delete(`/:userId/${route}/:id`, auth, controller.deleteUserSection.bind(controller))

  if (resume) {
    //El perfil público de un usuario no requiere auth
    router.get(`/:userId/resume/${route}`, controller.getUserResumeSectionAsync.bind(controller))
  }

});

router.get('/:userId/sectiondata', auth, getUserSectionDataAsync)

//El perfil público de un usuario no requiere auth
router.get('/:userId/resume', getUserResumeAsync)

export default router