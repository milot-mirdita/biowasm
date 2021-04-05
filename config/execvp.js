mergeInto(LibraryManager.library, {
  execvpe_js: function (file, argv, env) {
    if (typeof execve !== 'function') {
      return -1;
    }
    function charArrayToJS(ptr) {
      var arr = [];
      while(true) {
         var curr = getValue(ptr, '*');
         if (curr == 0) {
           break;
         }
         arr.push(UTF8ToString(curr));
         ptr += 4; // sizeof(void*)
      }
      return arr;
    }
    var err = execve(UTF8ToString(file), charArrayToJS(argv), charArrayToJS(env));
    if (err == 0) {
      _exit(0);
    }
    return err;
  }
});
