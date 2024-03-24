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
import { getUserResumeAsync, getUserBasicResumeAsync, postUserResumeJsonAsync, deleteResumeAsync } from '../controllers/user/userResume'

import { auth } from '../middlewares/auth'

const router = Router()

const controllers = [
  { route: 'work', controller: new UserWorkController() },
  { route: 'skill', controller: new UserSkillController() },
  { route: 'project', controller: new UserProjectController() },
  { route: 'profile', controller: new UserProfileController() },
  { route: 'basic', controller: new UserBasicController() },
  { route: 'section', controller: new UserSectionController() },
  { route: 'resource', controller: new UserResourceController() },
  { route: 'location', controller: new UserLocationController() },
  { route: 'volunteer', controller: new UserVolunteerController() },
  { route: 'education', controller: new UserEducationController() },
  { route: 'award', controller: new UserAwardController() },
  { route: 'certificate', controller: new UserCertificateController() },
  { route: 'publication', controller: new UserPublicationController() },
  { route: 'language', controller: new UserLanguageController() },
  { route: 'interest', controller: new UserInterestController() },
  { route: 'reference', controller: new UserReferenceController() },
]

controllers.forEach(c => {
  const { route, controller } = c
  router.get(`/:userId/${route}`, auth, controller.getUserSectionAsync.bind(controller))
  router.post(`/:userId/${route}`, auth, controller.createUserSection.bind(controller))
  router.put(`/:userId/${route}/:id`, auth, controller.updateUserSection.bind(controller))
  router.delete(`/:userId/${route}/:id`, auth, controller.deleteUserSection.bind(controller))

  if (controller.IsResumeSection) {
    //El perfil público de un usuario no requiere auth
    router.get(`/:userId/resume/${route}`, controller.getUserResumeSectionAsync.bind(controller))
  }

});

//El perfil público de un usuario no requiere auth
router.get('/:userId/resume/basic', getUserBasicResumeAsync)

router.get('/:userId/sectiondata', auth, getUserSectionDataAsync)

//El perfil público de un usuario no requiere auth
router.get('/:userId/resume', getUserResumeAsync)
router.post('/:userId/resume/json', auth, postUserResumeJsonAsync)
router.delete('/:userId/resume', auth, deleteResumeAsync)

export default router