#! /bin/bash

checkBranch () {
  branch=$(git branch | grep \* | cut -d " " -f2)
  if [ "$branch" != "master" ]
  then
    echo -e "\033[31m \n Only in master branch can be publish \n \033[0m"
    exit 1
  fi
}

checkBranch