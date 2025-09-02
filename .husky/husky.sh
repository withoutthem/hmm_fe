#!/bin/sh
# Husky 재호출 래퍼(권장 패턴). 퍼미션 문제 최소화.
if [ -z "$husky_skip_init" ]; then
  debug () { [ "$HUSKY_DEBUG" = "1" ] && echo "husky: $1"; }
  readonly hook_name="$(basename "$0")"
  debug "starting $hook_name..."
  [ "$HUSKY" = "0" ] && { debug "HUSKY=0 → skip"; exit 0; }
  [ -f ~/.huskyrc ] && { debug "sourcing ~/.huskyrc"; . ~/.huskyrc; }
  readonly husky_skip_init=1; export husky_skip_init
  sh -e "$0" "$@"; exitCode="$?"
  debug "finished $hook_name, exit code $exitCode"
  exit $exitCode
fi