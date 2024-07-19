interface FilterOptions {
  hideResolved?: boolean
  hideUnassigned?: boolean
  username?: {
    id: string
    name: string
  }
  reload?: boolean
}

const processComments = (comments: any[], options: FilterOptions, currentUser: string) => {
  let filteredComments = comments

  if (options?.hideResolved) {
    filteredComments = filteredComments.filter(comment => !comment.comments.some((c: any) => c.resolved))
  }
  if (options?.hideUnassigned) {
    filteredComments = filteredComments.filter(comment => comment.user !== 'Unassigned')
  }
  if (options?.username) {
    filteredComments = filteredComments.filter(comment => comment.user === currentUser)
  }
  return filteredComments
}

const filterComments = (comments: any[], options: FilterOptions, currentUser: string) => {
  return processComments(comments, options, currentUser)
}

export default filterComments
